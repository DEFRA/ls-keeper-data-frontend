import { sourceFilesController } from './controller.js'

export const sourceFiles = {
  plugin: {
    name: 'data-tools-source-files',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-tools/source-files',
          ...sourceFilesController
        }
      ])
    }
  }
}
