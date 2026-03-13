import { collections } from './collections/index.js'
import { reportingCollections } from './reporting-collections/index.js'
import { storage } from './storage/index.js'
import { cleanseData } from './cleanse-data/index.js'

export const systemMaintenance = {
  plugin: {
    name: 'system-maintenance',
    async register(server) {
      await server.register([collections, reportingCollections, storage, cleanseData])
    }
  }
}
