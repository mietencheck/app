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

function cleanId(oldId) {
  // post-post-XXXXX-de -> post-XXXXX-de
  if (oldId.startsWith('post-post-')) return oldId.replace(/^post-post-/, 'post-')
  if (oldId.startsWith('post-')) return oldId
  return `post-${oldId}`
}

// 1) Fetch all remaining post_v2 docs
const sourceDocs = await client.fetch(
  `*[_type == "post_v2" && !(_id in path("drafts.**"))]`
)
console.log('post_v2 docs to convert:', sourceDocs.length)

if (sourceDocs.length === 0) {
  console.log('Nothing to do.')
  process.exit(0)
}

// 2) Build ID map
const idMap = new Map()
for (const doc of sourceDocs) {
  const newId = cleanId(doc._id)
  idMap.set(doc._id, newId)
  console.log(`  ${doc._id}  →  ${newId}`)
}

// 3) Guards
for (const [oldId, newId] of idMap.entries()) {
  if (newId.includes('.')) {
    throw new Error(`Target ID contains dot: ${newId} (from ${oldId})`)
  }
}

const mappedIds = [...idMap.values()]
if (new Set(mappedIds).size !== mappedIds.length) {
  throw new Error('ID collision detected in mapped IDs')
}

// Check no collision with existing post docs
const existingIds = new Set(
  await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))]._id`)
)
for (const [oldId, newId] of idMap.entries()) {
  if (existingIds.has(newId)) {
    throw new Error(`Target ID already exists: ${newId} (from ${oldId})`)
  }
}

// 4) Find translation.metadata docs referencing old IDs
const metaDocs = await client.fetch(
  `*[_type == "translation.metadata" && references($ids)]`,
  {ids: [...idMap.keys()]}
)
console.log('translation.metadata to patch:', metaDocs.length)

// 5) Build transaction
let tx = client.transaction()

for (const doc of sourceDocs) {
  const newId = idMap.get(doc._id)
  const {_id, _rev, _createdAt, _updatedAt, _type, ...rest} = doc

  tx = tx.create({
    _id: newId,
    _type: 'post',
    ...rest,
  })
}

for (const meta of metaDocs) {
  if (!Array.isArray(meta.translations)) continue

  const patched = meta.translations.map((item) => {
    if (item?.value?._ref && idMap.has(item.value._ref)) {
      return {...item, value: {...item.value, _ref: idMap.get(item.value._ref)}}
    }
    return item
  })

  tx = tx.patch(meta._id, (p) => p.set({translations: patched}))
}

for (const doc of sourceDocs) {
  tx = tx.delete(doc._id)
}

console.log('\nPlanned:')
console.log('- create:', sourceDocs.length)
console.log('- delete:', sourceDocs.length)
console.log('- patch metadata:', metaDocs.length)

if (DRY_RUN) {
  console.log('\nDry run complete. No writes.')
  process.exit(0)
}

console.log('\nCommitting...')
const result = await tx.commit()
console.log('Committed:', result.transactionId)

const verify = await client.fetch(`{
  "postCount": count(*[_type=="post" && !(_id in path("drafts.**"))]),
  "postV2Count": count(*[_type=="post_v2" && !(_id in path("drafts.**"))]),
  "de": count(*[_type=="post" && language=="de" && !(_id in path("drafts.**"))]),
  "en": count(*[_type=="post" && language=="en" && !(_id in path("drafts.**"))])
}`)
console.log('\nVerify:', verify)