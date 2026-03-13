import { recordIdGeneratorController } from './controller.js'

export const recordIdGenerator = {
  plugin: {
    name: 'data-tools-record-id-generator',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-tools/record-id-generator',
          ...recordIdGeneratorController
        }
      ])
    }
  }
}
