/**
 * Converts internationalized-array fields from v4 (_key = language)
 * to v5 (dedicated `language` field).
 *
 * Run: SANITY_API_TOKEN=... pnpm migrate:i18n-v5
 */
import {createClient} from '@sanity/client'
import {randomKey} from '@sanity/util/content'

const client = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

type LocalizedItem = {
  _key?: string
  _type?: string
  language?: string
  value?: string
}

type LocalizedField = LocalizedItem[] | null | undefined

const STRING_VALUE_TYPE = 'internationalizedArrayStringValue'
const TEXT_VALUE_TYPE = 'internationalizedArrayTextValue'

function migrateLocalizedField(
  items: LocalizedField,
  valueType: typeof STRING_VALUE_TYPE | typeof TEXT_VALUE_TYPE,
) {
  if (!items?.length) return items

  let changed = false
  const next = items.map((item) => {
    if (item.language && item._type) {
      return item
    }

    const language = item.language ?? item._key
    if (!language) return item

    changed = true
    return {
      _type: valueType,
      _key: randomKey(12),
      language,
      value: item.value,
    }
  })

  return changed ? next : items
}

interface CategoryDocument {
  _id: string
  title?: LocalizedField
  slug?: LocalizedField
  description?: LocalizedField
}

async function migrate() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error(
      'Set SANITY_API_TOKEN with write access. Create one at sanity.io/manage → API → Tokens.',
    )
  }

  const categories = await client.fetch<CategoryDocument[]>(`*[_type == "category"]`)
  let migrated = 0
  let skipped = 0

  for (const category of categories) {
    const nextTitle = migrateLocalizedField(category.title, STRING_VALUE_TYPE)
    const nextSlug = migrateLocalizedField(category.slug, STRING_VALUE_TYPE)
    const nextDescription = migrateLocalizedField(category.description, TEXT_VALUE_TYPE)

    const changed =
      nextTitle !== category.title ||
      nextSlug !== category.slug ||
      nextDescription !== category.description

    if (!changed) {
      skipped++
      continue
    }

    await client
      .patch(category._id)
      .set({
        ...(nextTitle ? {title: nextTitle} : {}),
        ...(nextSlug ? {slug: nextSlug} : {}),
        ...(nextDescription ? {description: nextDescription} : {}),
      })
      .commit()

    migrated++
    console.log(`Migrated ${category._id}`)
  }

  console.log(`Done. Migrated ${migrated}, skipped ${skipped}.`)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
