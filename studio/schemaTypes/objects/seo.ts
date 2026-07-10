import {defineField} from 'sanity'

export const seoFields = [
  defineField({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    options: {
      collapsible: true,
      collapsed: true,
    },
    fields: [
      defineField({
        name: 'title',
        title: 'SEO title',
        type: 'string',
        description: 'Overrides the page title in search results (max ~60 characters).',
      }),
      defineField({
        name: 'description',
        title: 'Meta description',
        type: 'text',
        rows: 3,
        description: 'Shown in search results and social previews (max ~160 characters).',
      }),
      defineField({
        name: 'ogImage',
        title: 'Social image',
        type: 'image',
        description: 'Falls back to the main image when empty.',
        options: {hotspot: true},
      }),
      defineField({
        name: 'noIndex',
        title: 'Hide from search engines',
        type: 'boolean',
        initialValue: false,
      }),
    ],
  }),
]
