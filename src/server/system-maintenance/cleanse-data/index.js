import { cleanseDataController } from './controller.js'

export const cleanseData = {
  plugin: {
    name: 'system-maintenance-cleanse-data',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/cleanse-data',
          ...cleanseDataController
        }
      ])
    }
  }
}
