import fetch from 'node-fetch'
import { config } from '../../../config/config.js'
import { createLogger } from '../helpers/logging/logger.js'

const logger = createLogger()

async function bridgeGet(path, queryParams = {}) {
  const baseUrl = config.get('keeperDataBridge.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data Bridge GET request')

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Keeper Data Bridge error ${response.status} for ${path}: ${body}`
    )
  }

  return response.json()
}

async function bridgePost(path, body) {
  const baseUrl = config.get('keeperDataBridge.baseUrl')
  const url = new URL(path, baseUrl)

  logger.debug({ url: url.toString() }, 'Keeper Data Bridge POST request')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const responseBody = await response.text()
    throw new Error(
      `Keeper Data Bridge error ${response.status} for ${path}: ${responseBody}`
    )
  }

  return response.json()
}

export async function queryCollection(collectionName, params = {}) {
  return bridgeGet(`/api/query/${encodeURIComponent(collectionName)}`, params)
}

export async function getCatalogueFiles(sourceType = 'internal', days = 7) {
  const baseUrl = config.get('keeperDataBridge.baseUrl')
  const url = new URL('/api/externalcatalogue/files', baseUrl)
  url.searchParams.set('sourceType', sourceType)
  url.searchParams.set('days', days)

  const response = await fetch(url.toString(), {
    headers: { Accept: 'text/plain' }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Keeper Data Bridge error ${response.status} for /api/externalcatalogue/files: ${body}`
    )
  }

  return response.text()
}

export async function uploadRawFile(objectKey, content) {
  const baseUrl = config.get('keeperDataBridge.baseUrl')
  const url = new URL('/api/externalcatalogue/upload-raw', baseUrl)
  url.searchParams.set('objectKey', objectKey)

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'text/plain'
    },
    body: content
  })

  if (!response.ok) {
    const responseBody = await response.text()
    throw new Error(
      `Keeper Data Bridge error ${response.status} for upload-raw: ${responseBody}`
    )
  }

  return response.json()
}

export async function generateRecordId(keyParts) {
  return bridgePost('/api/import/generate-record-id', { KeyParts: keyParts })
}
