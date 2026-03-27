import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    // Localized title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({
          name: 'de',
          title: 'Title (DE)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'en',
          title: 'Title (EN)',
          type: 'string',
        }),
      ],
    }),

    // localized subtitle
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'object',
      fields: [
        defineField({
          name: 'de',
          title: 'Subtitle (DE)',
          type: 'string',
        }),
        defineField({
          name: 'en',
          title: 'Subtitle (EN)',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => doc?.title?.de,
        maxLength: 96,
      },
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
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({
          name: 'de',
          title: 'Body (DE)',
          type: 'blockContent',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'en',
          title: 'Body (EN)',
          type: 'blockContent',
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title.de',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
