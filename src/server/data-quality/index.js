import { analysisRuns } from './analysis-runs/index.js'
import { issues } from './issues/index.js'
import { notifications } from './notifications/index.js'

export const dataQuality = {
  plugin: {
    name: 'data-quality',
    async register(server) {
      await server.register([analysisRuns, issues, notifications])
    }
  }
}
