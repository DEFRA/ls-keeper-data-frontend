import { storageController } from './controller.js'

export const storage = {
  plugin: {
    name: 'system-maintenance-storage',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/storage',
          ...storageController
        }
      ])
    }
  }
}
