import {
  deleteReportingCollection,
  deleteAllReportingCollections
} from '../../common/services/keeper-data-api-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()

export const reportingCollectionsController = {
  handler(request, h) {
    const success = request.query.success
    const error = request.query.error

    return h.view('system-maintenance/reporting-collections/index', {
      pageTitle: 'Reporting Collections',
      heading: 'Reporting Collections',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' },
        {
          text: 'Reporting Collections',
          href: '/system-maintenance/reporting-collections'
        }
      ],
      success,
      error
    })
  }
}

export const deleteReportingCollectionController = {
  async handler(request, h) {
    const { collectionName } = request.payload

    if (!collectionName || collectionName.trim() === '') {
      return h
        .redirect(
          '/system-maintenance/reporting-collections?error=' +
            encodeURIComponent('Collection name is required')
        )
        .takeover()
    }

    try {
      logger.info(
        { collectionName },
        'Attempting to delete specific reporting collection'
      )
      await deleteReportingCollection(collectionName)
      logger.info(
        { collectionName },
        'Reporting collection deleted successfully'
      )

      return h
        .redirect(
          '/system-maintenance/reporting-collections?success=' +
            encodeURIComponent(
              `Reporting collection "${collectionName}" deleted`
            )
        )
        .takeover()
    } catch (err) {
      logger.error(
        { err, collectionName },
        'Failed to delete reporting collection'
      )
      return h
        .redirect(
          '/system-maintenance/reporting-collections?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}

export const deleteAllReportingCollectionsController = {
  async handler(request, h) {
    try {
      logger.info('Attempting to delete all reporting collections')
      await deleteAllReportingCollections()
      logger.info('All reporting collections deleted successfully')

      return h
        .redirect(
          '/system-maintenance/reporting-collections?success=' +
            encodeURIComponent('All reporting collections deleted')
        )
        .takeover()
    } catch (err) {
      logger.error({ err }, 'Failed to delete all reporting collections')
      return h
        .redirect(
          '/system-maintenance/reporting-collections?error=' +
            encodeURIComponent(err.message)
        )
        .takeover()
    }
  }
}
