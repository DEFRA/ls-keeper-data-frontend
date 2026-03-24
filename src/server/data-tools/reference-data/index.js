import { referenceDataController } from './controller.js'

export const referenceData = {
  plugin: {
    name: 'data-tools-reference-data',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-tools/reference-data',
          ...referenceDataController
        }
      ])
    }
  }
}
