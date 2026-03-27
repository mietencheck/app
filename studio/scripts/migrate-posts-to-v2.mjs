/* eslint-env node */
/* global console, process */

import {createClient} from '@sanity/client'

const DRY_RUN = process.env.DRY_RUN !== 'false'

const client = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: DRY_RUN ? undefined : process.env.SANITY_API_WRITE_TOKEN
})

console.log('Token length:', (process.env.SANITY_API_WRITE_TOKEN || '').length)

function toSlug(input) {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function hasMeaningfulBody(body) {
  return Array.isArray(body) && body.length > 0
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

const legacyPostsQuery = `*[_type == "post" && !(_id match "drafts.*")]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    subtitle,
    slug,
    author,
    mainImage,
    categories,
    publishedAt,
    body
}`

const existingV2Query = `*[_type == "post_v2"]{
  _id,
  translationGroup,
  language,
  "slug": slug.current
}`

const legacyPosts = await client.fetch(legacyPostsQuery)
const existingV2 = await client.fetch(existingV2Query)

console.log(`Legacy posts found: ${legacyPosts.length}`)
console.log(`Existing post_v2 docs: ${existingV2.length}`)

const planned = []
const seenTargetIds = new Set(existingV2.map((d) => d._id))

for (const legacy of legacyPosts) {
  const group = `legacy-${legacy._id.replace(/^drafts\./, '')}`

  const deTitle = legacy?.title?.de ?? ''
  const enTitle = legacy?.title?.en ?? ''
  const deBody = legacy?.body?.de ?? []
  const enBody = legacy?.body?.en ?? []

  const baseShared = {
    author: clone(legacy.author),
    mainImage: clone(legacy.mainImage),
    categories: clone(legacy.categories),
    publishedAt: legacy.publishedAt ?? null,
  }

  const baseId = legacy._id.replace(/^drafts\./, '')

  const deDoc = {
    _id: `post_v2.${baseId}.de`,
    _type: 'post_v2',
    translationGroup: group,
    language: 'de',
    title: deTitle,
    subtitle: legacy?.subtitle?.de ?? '',
    slug: {current: hasText(legacy?.slug?.current) ? legacy.slug.current : toSlug(deTitle)},
    body: clone(deBody),
    ...baseShared,
  }

  const shouldCreateEn = hasText(enTitle) || hasMeaningfulBody(enBody)

  const enDoc = shouldCreateEn
    ? {
        _id: `post_v2.${baseId}.en`,
        _type: 'post_v2',
        translationGroup: group,
        language: 'en',
        title: enTitle,
        subtitle: legacy?.subtitle?.en ?? '',
        slug: {current: toSlug(enTitle || `${deTitle}-en`)},
        body: clone(enBody),
        ...baseShared,
      }
    : null

  for (const doc of [deDoc, enDoc].filter(Boolean)) {
    if (seenTargetIds.has(doc._id)) {
      console.log(`[SKIP exists] ${doc._id}`)
      continue
    }
    planned.push(doc)
  }
}

console.log(`Planned post_v2 docs to create: ${planned.length}`)

const byLang = planned.reduce((acc, d) => {
  acc[d.language] = (acc[d.language] || 0) + 1
  return acc
}, {})
console.log('Planned by language:', byLang)

console.log('\nSample planned docs (first 5):')
for (const doc of planned.slice(0, 5)) {
  console.log(
    JSON.stringify(
      {
        _id: doc._id,
        language: doc.language,
        translationGroup: doc.translationGroup,
        slug: doc.slug?.current,
        title: doc.title,
      },
      null,
      2,
    ),
  )
}

// ---- Validation checks (still dry-run) ----
const errors = []
const warnings = []

// 1) Required fields
for (const doc of planned) {
  if (!hasText(doc.translationGroup)) errors.push(`Missing translationGroup: ${doc._id}`)
  if (!hasText(doc.language)) errors.push(`Missing language: ${doc._id}`)
  if (!hasText(doc.title)) warnings.push(`Empty title: ${doc._id}`)
  if (!hasText(doc?.slug?.current)) errors.push(`Missing slug.current: ${doc._id}`)
  if (!Array.isArray(doc.body)) warnings.push(`Body is not array: ${doc._id}`)
}

// 2) Duplicate (language + slug) within planned set
const slugLangSeen = new Map()
for (const doc of planned) {
  const key = `${doc.language}::${doc?.slug?.current || ''}`
  if (slugLangSeen.has(key)) {
    errors.push(`Duplicate planned language+slug: ${key} (${slugLangSeen.get(key)} and ${doc._id})`)
  } else {
    slugLangSeen.set(key, doc._id)
  }
}

// 3) Duplicate target IDs within planned set
const idSeen = new Set()
for (const doc of planned) {
  if (idSeen.has(doc._id)) {
    errors.push(`Duplicate planned _id: ${doc._id}`)
  } else {
    idSeen.add(doc._id)
  }
}

console.log('\nValidation results:')
console.log(`- errors: ${errors.length}`)
console.log(`- warnings: ${warnings.length}`)

if (warnings.length > 0) {
  console.log('\nWarnings:')
  for (const w of warnings.slice(0, 50)) console.log(`  - ${w}`)
  if (warnings.length > 50) console.log(`  ...and ${warnings.length - 50} more`)
}

if (errors.length > 0) {
  console.log('\nErrors:')
  for (const e of errors.slice(0, 50)) console.log(`  - ${e}`)
  if (errors.length > 50) console.log(`  ...and ${errors.length - 50} more`)
  throw new Error('Validation failed. Fix errors before writing.')
}

if (DRY_RUN) {
  console.log('\nDry run complete. No writes executed.')
  process.exit(0)
}

console.log('\nWrite mode enabled. Creating documents...')

let created = 0
let failed = 0

for (const doc of planned) {
  try {
    await client.createIfNotExists(doc)
    created += 1
    console.log(`[CREATE/EXISTS] ${doc._id}`)
  } catch (err) {
    failed += 1
    console.error(`[FAILED] ${doc._id}`, err?.message || err)
  }
}

console.log('\nWrite summary:')
console.log(`- attempted: ${planned.length}`)
console.log(`- createIfNotExists calls succeeded: ${created}`)
console.log(`- failed: ${failed}`)
console.log(`- skipped metric is implicit in createIfNotExists behavior`)

if (failed > 0) {
  throw new Error('Some documents failed to create')
}