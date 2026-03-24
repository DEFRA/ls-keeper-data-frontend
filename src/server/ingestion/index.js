import { pipeline } from './pipeline/index.js'
import { importReports } from './import-reports/index.js'
import { recordLineage } from './record-lineage/index.js'

export const ingestion = {
  plugin: {
    name: 'ingestion',
    async register(server) {
      await server.register([pipeline, importReports, recordLineage])
    }
  }
}
