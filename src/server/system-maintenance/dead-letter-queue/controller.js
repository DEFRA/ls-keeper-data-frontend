import {
  getDeadLetterQueueCount,
  getDeadLetterMessages,
  redriveDeadLetterMessages,
  purgeDeadLetterQueue
} from '../../common/services/keeper-data-admin-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const deadLetterQueueController = {
  async handler(_request, h) {
    let queueStats = null
    let error = null

    try {
      queueStats = await getDeadLetterQueueCount()
    } catch (err) {
      logger.error({ err }, 'Failed to fetch DLQ stats')
      error = err.message
    }

    return h.view('system-maintenance/dead-letter-queue/index', {
      pageTitle: 'Dead Letter Queue',
      heading: 'Dead Letter Queue',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' },
        {
          text: 'Dead Letter Queue',
          href: '/system-maintenance/dead-letter-queue'
        }
      ],
      queueStats,
      error
    })
  }
}

export const peekMessagesController = {
  async handler(request, h) {
    const maxMessages = Number.parseInt(request.query.maxMessages || '5', 10)

    try {
      const result = await getDeadLetterMessages(maxMessages)
      return h.response(result).code(200)
    } catch (err) {
      logger.error({ err }, 'Failed to peek DLQ messages')
      return h
        .response({
          error: 'Failed to peek messages',
          message: err.message
        })
        .code(500)
    }
  }
}

export const redriveMessagesController = {
  async handler(request, h) {
    const maxMessages = Number.parseInt(
      request.payload?.maxMessages || '10',
      10
    )

    try {
      const result = await redriveDeadLetterMessages(maxMessages)
      logger.info({ result }, 'Redrive DLQ messages completed')
      return h.response(result).code(200)
    } catch (err) {
      logger.error({ err }, 'Failed to redrive DLQ messages')
      return h
        .response({
          error: 'Failed to redrive messages',
          message: err.message
        })
        .code(500)
    }
  }
}

export const purgeQueueController = {
  async handler(_request, h) {
    try {
      const result = await purgeDeadLetterQueue()
      logger.info({ result }, 'Purge DLQ completed')
      return h.response(result).code(200)
    } catch (err) {
      logger.error({ err }, 'Failed to purge DLQ')
      return h
        .response({
          error: 'Failed to purge queue',
          message: err.message
        })
        .code(500)
    }
  }
}
