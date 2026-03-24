import { systemMaintenanceController } from './controller.js'
import { collections } from './collections/index.js'
import { reportingCollections } from './reporting-collections/index.js'
import { storage } from './storage/index.js'
import { cleanseData } from './cleanse-data/index.js'
import { deadLetterQueue } from './dead-letter-queue/index.js'

export const systemMaintenance = {
  plugin: {
    name: 'system-maintenance',
    async register(server) {
      // Landing page route
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance',
          ...systemMaintenanceController
        }
      ])

      await server.register([
        collections,
        reportingCollections,
        storage,
        cleanseData,
        deadLetterQueue
      ])
    }
  }
}
