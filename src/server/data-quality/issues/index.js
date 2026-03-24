import { issuesController } from './controller.js'

export const issues = {
  plugin: {
    name: 'data-quality-issues',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-quality/issues',
          ...issuesController
        }
      ])
    }
  }
}
