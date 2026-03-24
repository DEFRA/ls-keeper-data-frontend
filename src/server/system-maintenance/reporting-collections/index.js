import { reportingCollectionsController } from './controller.js'

export const reportingCollections = {
  plugin: {
    name: 'system-maintenance-reporting-collections',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/reporting-collections',
          ...reportingCollectionsController
        }
      ])
    }
  }
}
