import {
  deleteCollection,
  deleteAllCollections
} from '../../common/services/keeper-data-api-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const collectionsController = {
  handler(request, h) {
    const success = request.query.success
    const error = request.query.error

    return h.view('system-maintenance/collections/index', {
      pageTitle: 'Collections',
      heading: 'Collections',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' },
        { text: 'Collections', href: '/system-maintenance/collections' }
      ],
      success,
      error
    })
  }
}

export const deleteCollectionController = {
  async handler(request, h) {
    const { collectionName } = request.payload

    if (!collectionName || collectionName.trim() === '') {
      return h
        .redirect(
          '/system-maintenance/collections?error=' +
            encodeURIComponent('Collection name is required')
        )
        .takeover()
    }

    try {
      logger.info(
        { collectionName },
        'Attempting to delete specific collection'
      )
      await deleteCollection(collectionName)
      logger.info({ collectionName }, 'Collection deleted successfully')

      return h
        .redirect(
          '/system-maintenance/collections?success=' +
            encodeURIComponent(`Collection "${collectionName}" deleted`)
        )
        .takeover()
    } catch (err) {
      logger.error({ err, collectionName }, 'Failed to delete collection')
      return h
        .redirect(
          '/system-maintenance/collections?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}

export const deleteAllCollectionsController = {
  async handler(request, h) {
    try {
      logger.info('Attempting to delete all collections')
      await deleteAllCollections()
      logger.info('All collections deleted successfully')

      return h
        .redirect(
          '/system-maintenance/collections?success=' +
            encodeURIComponent('All collections deleted')
        )
        .takeover()
    } catch (err) {
      logger.error({ err }, 'Failed to delete all collections')
      return h
        .redirect(
          '/system-maintenance/collections?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}
