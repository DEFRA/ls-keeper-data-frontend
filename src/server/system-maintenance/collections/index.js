import {
  collectionsController,
  deleteCollectionController,
  deleteAllCollectionsController
} from './controller.js'

export const collections = {
  plugin: {
    name: 'system-maintenance-collections',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/collections',
          ...collectionsController
        },
        {
          method: 'POST',
          path: '/system-maintenance/collections/delete',
          ...deleteCollectionController
        },
        {
          method: 'POST',
          path: '/system-maintenance/collections/delete-all',
          ...deleteAllCollectionsController
        }
      ])
    }
  }
}
