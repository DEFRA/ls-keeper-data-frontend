import { referenceData } from './reference-data/index.js'
import { collectionQuery } from './collection-query/index.js'
import { sourceFiles } from './source-files/index.js'
import { recordIdGenerator } from './record-id-generator/index.js'

export const dataTools = {
  plugin: {
    name: 'data-tools',
    async register(server) {
      await server.register([referenceData, collectionQuery, sourceFiles, recordIdGenerator])
    }
  }
}
