import { pipelineController } from './controller.js'

export const pipeline = {
  plugin: {
    name: 'ingestion-pipeline',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/ingestion/pipeline',
          ...pipelineController
        }
      ])
    }
  }
}
