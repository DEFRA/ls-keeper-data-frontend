import { importReportsController } from './controller.js'

export const importReports = {
  plugin: {
    name: 'ingestion-import-reports',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/ingestion/import-reports',
          ...importReportsController
        }
      ])
    }
  }
}
