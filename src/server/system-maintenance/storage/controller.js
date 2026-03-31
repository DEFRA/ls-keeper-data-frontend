import { clearInternalStorage } from '../../common/services/keeper-data-api-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const storageController = {
  handler(request, h) {
    const success = request.query.success
    const error = request.query.error

    return h.view('system-maintenance/storage/index', {
      pageTitle: 'Storage',
      heading: 'Storage',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' },
        { text: 'Storage', href: '/system-maintenance/storage' }
      ],
      success,
      error
    })
  }
}

export const clearStorageController = {
  async handler(request, h) {
    const { sourceType } = request.payload

    if (!sourceType || sourceType.trim() === '') {
      return h
        .redirect(
          '/system-maintenance/storage?error=' +
            encodeURIComponent('Source type is required')
        )
        .takeover()
    }

    try {
      logger.info({ sourceType }, 'Attempting to clear internal storage')
      await clearInternalStorage(sourceType)
      logger.info({ sourceType }, 'Internal storage cleared successfully')

      return h
        .redirect(
          '/system-maintenance/storage?success=' +
            encodeURIComponent(
              `Storage cleared for source type "${sourceType}"`
            )
        )
        .takeover()
    } catch (err) {
      logger.error({ err, sourceType }, 'Failed to clear internal storage')
      return h
        .redirect(
          '/system-maintenance/storage?error=' + encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}
