import {
  deadLetterQueueController,
  redriveMessagesController,
  purgeQueueController
} from './controller.js'

export const deadLetterQueue = {
  plugin: {
    name: 'system-maintenance-dead-letter-queue',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/system-maintenance/dead-letter-queue',
          ...deadLetterQueueController
        },
        {
          method: 'POST',
          path: '/system-maintenance/dead-letter-queue/redrive',
          ...redriveMessagesController
        },
        {
          method: 'POST',
          path: '/system-maintenance/dead-letter-queue/purge',
          ...purgeQueueController
        }
      ])
    }
  }
}
