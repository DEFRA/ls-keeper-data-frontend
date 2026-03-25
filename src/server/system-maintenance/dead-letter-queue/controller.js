import {
  getDeadLetterQueueCount,
  getDeadLetterMessages,
  redriveDeadLetterMessages,
  purgeDeadLetterQueue
} from '../../common/services/keeper-data-admin-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const deadLetterQueueController = {
  async handler(request, h) {
    let queueStats = null
    let error = null
    let messages = null
    let successMessage = null

    // Handle peek action via query parameter
    const action = request.query.action
    
    // Handle success messages from redirects
    if (request.query.success === 'redrive') {
      successMessage = `Redrive completed! Processed: ${request.query.processed}, Successful: ${request.query.successful}, Failed: ${request.query.failed}`
    } else if (request.query.success === 'purge') {
      successMessage = 'Queue purged successfully!'
    }
    
    // Handle error messages from redirects
    if (request.query.error) {
      error = decodeURIComponent(request.query.error)
    }

    try {
      queueStats = await getDeadLetterQueueCount()

      // If peek action is requested, fetch messages
      if (action === 'peek') {
        const maxMessages = Number.parseInt(request.query.maxMessages || '5', 10)
        const result = await getDeadLetterMessages(maxMessages)
        messages = result
      }
    } catch (err) {
      logger.error({ err }, 'Failed to fetch DLQ data')
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
      error,
      messages,
      successMessage
    })
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
      
      // Redirect back to main page with success message
      return h.redirect('/system-maintenance/dead-letter-queue?success=redrive&processed=' + result.processedCount + '&successful=' + result.successCount + '&failed=' + result.failureCount)
    } catch (err) {
      logger.error({ err }, 'Failed to redrive DLQ messages')
      return h.redirect('/system-maintenance/dead-letter-queue?error=' + encodeURIComponent(err.message))
    }
  }
}

export const purgeQueueController = {
  async handler(_request, h) {
    try {
      const result = await purgeDeadLetterQueue()
      logger.info({ result }, 'Purge DLQ completed')
      return h.redirect('/system-maintenance/dead-letter-queue?success=purge')
    } catch (err) {
      logger.error({ err }, 'Failed to purge DLQ')
      return h.redirect('/system-maintenance/dead-letter-queue?error=' + encodeURIComponent(err.message))
    }
  }
}
