import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'mietencheck-blog',
  projectId: 'te770b4o',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'de', title: 'German'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: ['post_v2'],
      languageField: 'language',
      allowCreateMetaDoc: true,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
