import {
  reportingCollectionsController,
  deleteReportingCollectionController,
  deleteAllReportingCollectionsController
} from './controller.js'

export const reportingCollections = {
  plugin: {
    name: 'system-maintenance-reporting-collections',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/reporting-collections',
          ...reportingCollectionsController
        },
        {
          method: 'POST',
          path: '/system-maintenance/reporting-collections/delete',
          ...deleteReportingCollectionController
        },
        {
          method: 'POST',
          path: '/system-maintenance/reporting-collections/delete-all',
          ...deleteAllReportingCollectionsController
        }
      ])
    }
  }
}
