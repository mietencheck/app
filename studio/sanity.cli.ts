import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'te770b4o',
    dataset: 'production',
  },
  deployment: {
    appId: 'ohxgi5be2vxmvzi8ysb6mnbf',
    autoUpdates: true,
  },
  typegen: {
    path: '../src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/sanity/sanity.types.ts',
  },
})
