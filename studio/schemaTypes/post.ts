import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {seoFields} from './objects/seo'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'translationGroup',
      title: 'Translation group',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'German', value: 'de'},
          {title: 'English', value: 'en'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Displayed below the title on the article page.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary for article cards and meta description fallback.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          const current = slug?.current
          if (!current) return true

          const {document, getClient} = context
          const language = document?.language
          if (!language) return true

          const id = document?._id?.replace(/^drafts\./, '')
          const client = getClient({apiVersion: '2025-01-01'})
          const count = await client.fetch(
            `count(*[
              _type == "post" &&
              slug.current == $slug &&
              language == $language &&
              !(_id in [$draftId, $publishedId])
            ])`,
            {
              slug: current,
              language,
              draftId: `drafts.${id}`,
              publishedId: id,
            },
          )

          return count === 0 || 'Slug already exists for this language'
        }),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO.',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
      initialValue: [],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on blog index',
      type: 'boolean',
      initialValue: false,
      description: 'Only one post per language should be featured.',
      validation: (Rule) =>
        Rule.custom(async (featured, context) => {
          if (!featured) return true

          const {document, getClient} = context
          const language = document?.language
          if (!language) return true

          const id = document?._id?.replace(/^drafts\./, '')
          const client = getClient({apiVersion: '2025-01-01'})
          const count = await client.fetch(
            `count(*[
              _type == "post" &&
              featured == true &&
              language == $language &&
              !(_id in [$draftId, $publishedId])
            ])`,
            {
              language,
              draftId: `drafts.${id}`,
              publishedId: id,
            },
          )

          return count === 0 || 'Another post is already featured for this language'
        }),
    }),
    ...seoFields,
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      author: 'author.name',
      media: 'mainImage',
      featured: 'featured',
    },
    prepare(selection) {
      const {language, author, title, media, featured} = selection
      const langLabel = language ? `[${language.toUpperCase()}]` : '[??]'
      const flags = [featured ? '★' : null, author ? `by ${author}` : null]
        .filter(Boolean)
        .join(' · ')

      return {
        title: `${langLabel} ${title ?? ''}`.trim(),
        subtitle: flags || undefined,
        media,
      }
    },
  },
})
