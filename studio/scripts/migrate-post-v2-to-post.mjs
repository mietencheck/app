/* eslint-env node */
/* global console, process */

import {createClient} from '@sanity/client'

const DRY_RUN = process.env.DRY_RUN !== 'false'

const client = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

console.log('DRY_RUN:', DRY_RUN)
console.log('Token length:', (process.env.SANITY_API_WRITE_TOKEN || '').length)

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error('Missing SANITY_API_WRITE_TOKEN')
}

function clone(v) {
  return v == null ? v : JSON.parse(JSON.stringify(v))
}

function toPostIdFromPostV2Id(oldId) {
  // Examples:
  // post_v2-4102ab44-b546-4bc7-8ef0-ee1b60e8c422-en -> post-4102ab44-b546-4bc7-8ef0-ee1b60e8c422-en
  // post_v2.4102ab44-b546-4bc7-8ef0-ee1b60e8c422.en -> post-4102ab44-b546-4bc7-8ef0-ee1b60e8c422-en
  // 1b314678-0b22-4c20-aae5-1a9eedbc4944            -> post-1b314678-0b22-4c20-aae5-1a9eedbc4944
  if (oldId.startsWith('post_v2-')) return oldId.replace(/^post_v2-/, 'post-')
  if (oldId.startsWith('post_v2.')) return oldId.replace(/^post_v2\./, 'post-').replace(/\./g, '-')
  return `post-${oldId}`
}

function remapInternalRefsInBody(body, idMap) {
  if (!Array.isArray(body)) return body
  return body.map((block) => {
    if (!block || typeof block !== 'object') return block
    const next = {...block}

    if (Array.isArray(next.markDefs)) {
      next.markDefs = next.markDefs.map((md) => {
        if (!md || typeof md !== 'object') return md

        // Some content may store _ref directly on markDef
        if (typeof md._ref === 'string' && idMap.has(md._ref)) {
          return {...md, _ref: idMap.get(md._ref)}
        }

        // Standard internalLink schema stores reference._ref
        if (
          md.reference &&
          typeof md.reference === 'object' &&
          typeof md.reference._ref === 'string' &&
          idMap.has(md.reference._ref)
        ) {
          return {...md, reference: {...md.reference, _ref: idMap.get(md.reference._ref)}}
        }

        return md
      })
    }

    return next
  })
}

// 1) Read all post_v2 published docs
const sourceDocs = await client.fetch(
    `*[_type == "post_v2" && !(_id in path("drafts.**"))]`
  )
console.log('post_v2 published docs:', sourceDocs.length)

if (sourceDocs.length === 0) {
  console.log('No post_v2 docs found. Nothing to do.')
  process.exit(0)
}

// 2) Build ID map old->new
const idMap = new Map()
for (const doc of sourceDocs) {
  idMap.set(doc._id, toPostIdFromPostV2Id(doc._id))
}

// ---- Extra guard 1: detect collisions inside new ID map ----
const mappedIds = [...idMap.values()]
const uniqueMapped = new Set(mappedIds)
if (uniqueMapped.size !== mappedIds.length) {
  throw new Error('Internal ID-map collision detected (two source docs map to same target ID)')
}

// ---- Extra guard 2: ensure no generated ID contains dots ----
for (const [oldId, newId] of idMap.entries()) {
  if (newId.includes('.')) {
    throw new Error(`Invalid target ID contains dot: ${newId} (from ${oldId})`)
  }
}

// 3) Validate no target collisions with existing post docs
const existingPostIds = new Set(await client.fetch(`*[_type == "post" && !(_id match "drafts.*")]._id`))
for (const [oldId, newId] of idMap.entries()) {
  if (existingPostIds.has(newId)) {
    throw new Error(`Target post ID already exists: ${newId} (from ${oldId})`)
  }
}

// 4) Find translation metadata docs that reference old post_v2 IDs
const metaDocs = await client.fetch(`*[_type == "translation.metadata" && references($ids)]`, {
  ids: [...idMap.keys()],
})
console.log('translation.metadata affected:', metaDocs.length)

// 5) Build transaction
let tx = client.transaction()
let createCount = 0
let deleteCount = 0
let patchMetaCount = 0

for (const doc of sourceDocs) {
  const newId = idMap.get(doc._id)
  const {_id, _rev, _createdAt, _updatedAt, _type, ...rest} = doc

  const nextDoc = {
    _id: newId,
    _type: 'post',
    ...clone(rest),
  }

  // remap internal refs in body from old post_v2 IDs -> new post IDs
  if (Array.isArray(nextDoc.body)) {
    nextDoc.body = remapInternalRefsInBody(nextDoc.body, idMap)
  }

  tx = tx.create(nextDoc)
  createCount += 1
}

for (const meta of metaDocs) {
  if (!Array.isArray(meta.translations)) continue

  const patchedTranslations = meta.translations.map((item) => {
    if (item?.value?._ref && idMap.has(item.value._ref)) {
      return {
        ...item,
        value: {...item.value, _ref: idMap.get(item.value._ref)},
      }
    }
    return item
  })

  tx = tx.patch(meta._id, (p) => p.set({translations: patchedTranslations}))
  patchMetaCount += 1
}

// delete old post_v2 docs after creates/patches in same transaction
for (const doc of sourceDocs) {
  tx = tx.delete(doc._id)
  deleteCount += 1
}

console.log('\nPlanned transaction:')
console.log('- create post docs:', createCount)
console.log('- patch metadata docs:', patchMetaCount)
console.log('- delete old post_v2 docs:', deleteCount)

if (DRY_RUN) {
  console.log('\nDry run complete. No writes executed.')
  process.exit(0)
}

console.log('\nCommitting...')
const result = await tx.commit()
console.log('Committed transaction:', result.transactionId)

// 6) Verify
const verify = await client.fetch(`{
  "postCount": count(*[_type=="post" && !(_id match "drafts.*")]),
  "postV2Count": count(*[_type=="post_v2" && !(_id match "drafts.*")]),
  "de": count(*[_type=="post" && language=="de" && !(_id match "drafts.*")]),
  "en": count(*[_type=="post" && language=="en" && !(_id match "drafts.*")])
}`)
console.log('\nVerify:', verify)