import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {SUPPORTED_LANGUAGES} from './languages'

export default defineConfig({
  name: 'default',
  title: 'mietencheck-blog',
  projectId: 'te770b4o',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    internationalizedArray({
      languages: [...SUPPORTED_LANGUAGES],
      defaultLanguages: ['de'],
      fieldTypes: ['string', 'text'],
    }),
    documentInternationalization({
      supportedLanguages: [...SUPPORTED_LANGUAGES],
      schemaTypes: ['post'],
      languageField: 'language',
      allowCreateMetaDoc: true,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
