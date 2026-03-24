import { analysisRunsController } from './controller.js'

export const analysisRuns = {
  plugin: {
    name: 'data-quality-analysis-runs',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-quality/analysis-runs',
          ...analysisRunsController
        }
      ])
    }
  }
}
