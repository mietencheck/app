/**
 * One-time migration: categories[] → category (single reference).
 * Keeps the first assigned category when multiple exist.
 *
 * Run: pnpm migrate:post-category
 */
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'te770b4o',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

interface LegacyPost {
  _id: string
  title?: string
  categories?: Array<{_ref: string; _type: 'reference'; _key?: string}>
  category?: {_ref: string; _type: 'reference'}
}

async function main() {
  const posts = await client.fetch<LegacyPost[]>(
    `*[_type == "post"]{ _id, title, categories, category }`,
  )

  let migrated = 0
  const transaction = client.transaction()

  for (const post of posts) {
    const nextCategory = post.category ?? post.categories?.[0]
    const needsCategory = Boolean(nextCategory && !post.category)
    const needsUnset = Boolean(post.categories?.length)

    if (!needsCategory && !needsUnset) continue

    let patch = client.patch(post._id)

    if (needsCategory && nextCategory) {
      patch = patch.set({
        category: {_type: 'reference', _ref: nextCategory._ref},
      })
    }

    if (needsUnset) {
      patch = patch.unset(['categories'])
    }

    transaction.patch(patch)
    migrated += 1
    console.log(`Queued ${post._id} (${post.title ?? 'untitled'})`)
  }

  if (migrated === 0) {
    console.log('No posts to migrate.')
    return
  }

  await transaction.commit()
  console.log(`Done. Migrated ${migrated} post(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
