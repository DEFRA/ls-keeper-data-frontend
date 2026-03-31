import {
  cleanseDataController,
  deleteCleanseDataController,
  deleteCleanseMetadataController
} from './controller.js'

export const cleanseData = {
  plugin: {
    name: 'system-maintenance-cleanse-data',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/cleanse-data',
          ...cleanseDataController
        },
        {
          method: 'POST',
          path: '/system-maintenance/cleanse-data/delete-data',
          ...deleteCleanseDataController
        },
        {
          method: 'POST',
          path: '/system-maintenance/cleanse-data/delete-metadata',
          ...deleteCleanseMetadataController
        }
      ])
    }
  }
}
