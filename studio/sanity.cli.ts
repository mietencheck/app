import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'te770b4o',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/sanity/sanity.types.ts',
    overloads: {
      generation: {
        mode: 'replace',
      },
    },
  },
})
