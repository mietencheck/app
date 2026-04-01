import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
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
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
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
      initialValue: [],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      language: 'language',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {language, author, title, media} = selection
      const langLabel = language ? `[${language.toUpperCase()}]` : '[??]'
      const subtitleParts = [author ? `by ${author}` : null].filter(Boolean)
      return {
        title: `${langLabel} ${title ?? ''}`.trim(),
        subtitle: subtitleParts.join(' '),
        media,
      }
    },
  },
})
