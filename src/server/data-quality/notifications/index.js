import { notificationsController } from './controller.js'

export const notifications = {
  plugin: {
    name: 'data-quality-notifications',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/data-quality/notifications',
          ...notificationsController
        }
      ])
    }
  }
}
