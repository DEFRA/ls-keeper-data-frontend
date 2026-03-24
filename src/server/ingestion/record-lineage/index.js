import { recordLineageController } from './controller.js'

export const recordLineage = {
  plugin: {
    name: 'ingestion-record-lineage',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/ingestion/record-lineage',
          ...recordLineageController
        }
      ])
    }
  }
}
