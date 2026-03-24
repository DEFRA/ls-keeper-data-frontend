import {
  getCatalogueFiles,
  uploadRawFile
} from '../../common/services/keeper-data-bridge-client.js'

const SOURCE_TYPES = ['internal', 'external']

const baseViewModel = {
  pageTitle: 'Source Files',
  heading: 'Source Files',
  caption: 'Data Tools',
  breadcrumbs: [
    { text: 'Home', href: '/' },
    { text: 'Data Tools', href: '/data-tools/reference-data' },
    { text: 'Source Files', href: '/data-tools/source-files' }
  ]
}

export const sourceFilesGetController = {
  async handler(request, h) {
    const { sourceType = 'internal', days = '7' } = request.query
    const hasQuery = request.query.sourceType !== undefined

    let catalogueResult = null
    let catalogueError = null

    if (hasQuery) {
      try {
        catalogueResult = await getCatalogueFiles(sourceType, days)
      } catch (err) {
        catalogueError = `Failed to fetch catalogue files: ${err.message}`
      }
    }

    return h.view('data-tools/source-files/index', {
      ...baseViewModel,
      sourceTypes: SOURCE_TYPES,
      filters: { sourceType, days },
      hasQuery,
      catalogueResult,
      catalogueError,
      uploadSuccess: null,
      uploadError: null
    })
  }
}

export const sourceFilesPostController = {
  async handler(request, h) {
    const { objectKey, content } = request.payload || {}

    let uploadSuccess = null
    let uploadError = null

    if (!objectKey || !content) {
      uploadError = 'Object key and file content are required.'
    } else {
      try {
        await uploadRawFile(objectKey, content)
        uploadSuccess = `File uploaded successfully to object key: ${objectKey}`
      } catch (err) {
        uploadError = `Upload failed: ${err.message}`
      }
    }

    return h.view('data-tools/source-files/index', {
      ...baseViewModel,
      sourceTypes: SOURCE_TYPES,
      filters: { sourceType: 'internal', days: '7' },
      hasQuery: false,
      catalogueResult: null,
      catalogueError: null,
      uploadSuccess,
      uploadError,
      uploadPayload: { objectKey, content }
    })
  }
}

export const sourceFilesController = sourceFilesGetController
