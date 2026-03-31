import {
  deleteCleanseData,
  deleteCleanseMetadata
} from '../../common/services/keeper-data-api-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const cleanseDataController = {
  handler(request, h) {
    const success = request.query.success
    const error = request.query.error

    return h.view('system-maintenance/cleanse-data/index', {
      pageTitle: 'Cleanse Data',
      heading: 'Cleanse Data',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' },
        { text: 'Cleanse Data', href: '/system-maintenance/cleanse-data' }
      ],
      success,
      error
    })
  }
}

export const deleteCleanseDataController = {
  async handler(request, h) {
    try {
      logger.info('Attempting to delete cleanse data')
      await deleteCleanseData()
      logger.info('Cleanse data deleted successfully')

      return h
        .redirect(
          '/system-maintenance/cleanse-data?success=' +
            encodeURIComponent('Cleanse data deleted')
        )
        .takeover()
    } catch (err) {
      logger.error({ err }, 'Failed to delete cleanse data')
      return h
        .redirect(
          '/system-maintenance/cleanse-data?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}

export const deleteCleanseMetadataController = {
  async handler(request, h) {
    try {
      logger.info('Attempting to delete cleanse metadata')
      await deleteCleanseMetadata()
      logger.info('Cleanse metadata deleted successfully')

      return h
        .redirect(
          '/system-maintenance/cleanse-data?success=' +
            encodeURIComponent('Cleanse metadata deleted')
        )
        .takeover()
    } catch (err) {
      logger.error({ err }, 'Failed to delete cleanse metadata')
      return h
        .redirect(
          '/system-maintenance/cleanse-data?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}
