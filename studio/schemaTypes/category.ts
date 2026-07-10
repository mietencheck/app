import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

type LocalizedItem = {
  _key?: string
  language?: string
  value?: string
}

function localizedValue(items: LocalizedItem[] | undefined, language: string) {
  return items?.find((item) => item.language === language || item._key === language)?.value
}

function requireGermanTitle(items: LocalizedItem[] | undefined) {
  const germanTitle = localizedValue(items, 'de')?.trim()
  return germanTitle ? true : 'German title is required'
}

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.custom(requireGermanTitle),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'internationalizedArrayString',
      description: 'URL slug per language (e.g. mietrecht / tenancy-law).',
      validation: (Rule) => Rule.custom(requireGermanTitle),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare({title, description}) {
      const deTitle = localizedValue(title, 'de')
      const enTitle = localizedValue(title, 'en')
      const deDescription = localizedValue(description, 'de')

      return {
        title: deTitle ?? 'Untitled category',
        subtitle: enTitle ?? deDescription ?? undefined,
      }
    },
  },
})
