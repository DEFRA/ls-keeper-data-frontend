import { collectionQueryController } from './controller.js'

export const collectionQuery = {
  plugin: {
    name: 'data-tools-collection-query',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-tools/collection-query',
          ...collectionQueryController
        }
      ])
    }
  }
}
