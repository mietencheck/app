/**
 * One-time migration: plain category fields → internationalized arrays.
 * Existing German values are copied to the `de` locale; add English in Studio.
 *
 * Run: pnpm migrate:category-i18n
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

interface LegacyCategory {
  _id: string
  title?: string | Array<{_key: string; value?: string}>
  slug?: {current?: string} | Array<{_key: string; value?: string}>
  description?: string | Array<{_key: string; value?: string}>
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLocalizedArray(
  value: string | Array<{_key?: string; language?: string; value?: string}> | undefined,
  language = 'de',
  valueType: 'internationalizedArrayStringValue' | 'internationalizedArrayTextValue',
) {
  if (!value) return undefined
  if (Array.isArray(value)) return value
  return [
    {
      _type: valueType,
      _key: randomKey(12),
      language,
      value,
    },
  ]
}

async function migrate() {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error(
      'Set SANITY_API_TOKEN with write access. Create one at sanity.io/manage → API → Tokens.',
    )
  }

  const categories = await client.fetch<LegacyCategory[]>(`*[_type == "category"]`)
  let migrated = 0
  let skipped = 0

  for (const category of categories) {
    if (Array.isArray(category.title)) {
      skipped++
      continue
    }

    const germanTitle = typeof category.title === 'string' ? category.title : undefined
    const nextTitle = toLocalizedArray(category.title, 'de', 'internationalizedArrayStringValue')
    const legacySlug =
      typeof category.slug === 'object' && category.slug && 'current' in category.slug
        ? category.slug.current
        : undefined
    const nextSlug = toLocalizedArray(
      legacySlug ?? (germanTitle ? slugify(germanTitle) : undefined),
      'de',
      'internationalizedArrayStringValue',
    )
    const nextDescription = toLocalizedArray(
      category.description,
      'de',
      'internationalizedArrayTextValue',
    )

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

  console.log(`Done. Migrated ${migrated}, skipped ${skipped} (already localized).`)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
