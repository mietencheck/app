/* eslint-env node */
/* global console, process */

import {createClient} from '@sanity/client'

const DRY_RUN = process.env.DRY_RUN !== 'false'

const client = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: DRY_RUN ? undefined : process.env.SANITY_API_WRITE_TOKEN,
})

console.log('DRY_RUN:', DRY_RUN)
console.log('Token length:', (process.env.SANITY_API_WRITE_TOKEN || '').length)

function newId(oldId) {
  return oldId.replace(/\./g, '-')
}

// 1. Fetch all post_v2 documents (need token to see them all since dotted IDs are restricted)
const tokenClient = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const allPostV2 = await tokenClient.fetch(`*[_type == "post_v2" && !(_id match "drafts.*")]`)
const dottedDocs = allPostV2.filter((d) => d._id.includes('.') && !d._id.startsWith('drafts.'))
const cleanDocs = allPostV2.filter((d) => !d._id.includes('.') || d._id.startsWith('drafts.'))

console.log(`\nTotal post_v2 documents: ${allPostV2.length}`)
console.log(`Documents with dotted IDs (need fixing): ${dottedDocs.length}`)
console.log(`Documents with clean IDs (no change needed): ${cleanDocs.length}`)

if (dottedDocs.length === 0) {
  console.log('\nNo dotted IDs found. Nothing to do.')
  process.exit(0)
}

// Build the old→new ID mapping
const idMap = new Map()
for (const doc of dottedDocs) {
  const fresh = newId(doc._id)
  idMap.set(doc._id, fresh)
  console.log(`  ${doc._id}  →  ${fresh}`)
}

// Check for collisions with existing clean docs
const existingIds = new Set(allPostV2.map((d) => d._id))
for (const [oldId, freshId] of idMap) {
  if (existingIds.has(freshId)) {
    console.error(`\nCOLLISION: new ID "${freshId}" already exists! (from "${oldId}")`)
    process.exit(1)
  }
}

// 2. Fetch translation.metadata documents that might reference old IDs
const metaDocs = await tokenClient.fetch(
  `*[_type == "translation.metadata" && references($ids)]`,
  {ids: dottedDocs.map((d) => d._id)},
)
console.log(`\nTranslation metadata docs referencing dotted IDs: ${metaDocs.length}`)

// 3. Build the transaction
let tx = client.transaction()

for (const doc of dottedDocs) {
  const freshId = idMap.get(doc._id)

  // Strip Sanity internal fields before re-creating
  const {_id, _rev, _createdAt, _updatedAt, ...content} = doc

  // Rewrite any internal-link references inside body PortableText
  if (Array.isArray(content.body)) {
    content.body = rewriteBodyRefs(content.body, idMap)
  }

  tx = tx.createIfNotExists({_id: freshId, ...content})
  tx = tx.delete(doc._id)
}

// 4. Patch translation.metadata docs: swap old refs for new
for (const meta of metaDocs) {
  if (!Array.isArray(meta.translations)) continue

  const updatedTranslations = meta.translations.map((entry) => {
    if (entry?.value?._ref && idMap.has(entry.value._ref)) {
      return {
        ...entry,
        value: {...entry.value, _ref: idMap.get(entry.value._ref)},
      }
    }
    return entry
  })

  tx = tx.patch(meta._id, (p) => p.set({translations: updatedTranslations}))
}

// Helper: walk PortableText blocks and rewrite _ref values
function rewriteBodyRefs(blocks, mapping) {
  return blocks.map((block) => {
    const patched = {...block}
    if (Array.isArray(patched.markDefs)) {
      patched.markDefs = patched.markDefs.map((md) => {
        if (md._type === 'internalLink' && md._ref && mapping.has(md._ref)) {
          return {...md, _ref: mapping.get(md._ref)}
        }
        if (md._type === 'internalLink' && md.reference?._ref && mapping.has(md.reference._ref)) {
          return {...md, reference: {...md.reference, _ref: mapping.get(md.reference._ref)}}
        }
        return md
      })
    }
    return patched
  })
}

// Summary
console.log(`\nTransaction summary:`)
console.log(`  - createIfNotExists: ${dottedDocs.length}`)
console.log(`  - delete (old dotted IDs): ${dottedDocs.length}`)
console.log(`  - patch metadata docs: ${metaDocs.length}`)

if (DRY_RUN) {
  console.log('\nDry run complete. No writes executed.')
  process.exit(0)
}

console.log('\nCommitting transaction...')
try {
  const result = await tx.commit()
  console.log('Transaction committed successfully.')
  console.log(`  transactionId: ${result.transactionId}`)
  console.log(`  results: ${result.results?.length ?? 'n/a'}`)
} catch (err) {
  console.error('Transaction FAILED:', err?.message || err)
  process.exit(1)
}

// Verify: fetch post_v2 docs without token to confirm public access
console.log('\nVerifying public access (unauthenticated)...')
const publicClient = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
})
const publicDocs = await publicClient.fetch(`*[_type == "post_v2"]{_id, language, "slug": slug.current}`)
console.log(`Publicly visible post_v2 docs: ${publicDocs.length}`)
for (const d of publicDocs) {
  console.log(`  [${d.language}] ${d._id} → ${d.slug}`)
}
