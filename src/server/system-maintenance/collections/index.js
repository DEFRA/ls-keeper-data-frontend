import { collectionsController } from './controller.js'

export const collections = {
  plugin: {
    name: 'system-maintenance-collections',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/collections',
          ...collectionsController
        }
      ])
    }
  }
}
