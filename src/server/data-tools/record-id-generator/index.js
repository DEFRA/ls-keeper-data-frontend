import {
  recordIdGeneratorGetController,
  recordIdGeneratorPostController
} from './controller.js'

export const recordIdGenerator = {
  plugin: {
    name: 'data-tools-record-id-generator',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-tools/record-id-generator',
          ...recordIdGeneratorGetController
        },
        {
          method: 'POST',
          path: '/data-tools/record-id-generator',
          ...recordIdGeneratorPostController
        }
      ])
    }
  }
}
