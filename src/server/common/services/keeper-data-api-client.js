import fetch from 'node-fetch'
import { config } from '../../../config/config.js'
import { createLogger } from '../helpers/logging/logger.js'

const logger = createLogger()

function buildBasicAuthHeader() {
  const authHeader = config.get('keeperDataApi.authHeader')

  // If authHeader is provided, use it directly with Basic prefix
  if (authHeader) {
    return `Basic ${authHeader}`
  }

  // Otherwise construct from username:password
  const username = config.get('keeperDataApi.username')
  const password = config.get('keeperDataApi.password')
  const credentials = `${username}:${password}`
  return `Basic ${Buffer.from(credentials).toString('base64')}`
}

async function apiGet(path, queryParams = {}) {
  const baseUrl = config.get('keeperDataApi.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data API GET request')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: buildBasicAuthHeader(),
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    // Handle 404 as empty result for list endpoints
    if (
      response.status === 404 &&
      (path.includes('/sites') ||
        path.includes('/parties') ||
        path.includes('/countries')) &&
      !path.match(/\/[^/]+$/)
    ) {
      return { values: [], totalCount: 0 }
    }

    const body = await response.text()
    throw new Error(
      `Keeper Data API error ${response.status} for ${path}: ${body}`
    )
  }

  return response.json()
}

async function apiDelete(path, queryParams = {}) {
  const baseUrl = config.get('keeperDataApi.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data API DELETE request')

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      Authorization: buildBasicAuthHeader(),
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Keeper Data API error ${response.status} for ${path}: ${body}`
    )
  }

  // Some DELETE endpoints return 204 No Content
  if (response.status === 204) {
    return { success: true }
  }

  return response.json()
}

async function apiPost(path, body = null, queryParams = {}) {
  const baseUrl = config.get('keeperDataApi.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data API POST request')

  const options = {
    method: 'POST',
    headers: {
      Authorization: buildBasicAuthHeader(),
      Accept: 'application/json'
    }
  }

  if (body) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url.toString(), options)

  if (!response.ok) {
    const responseBody = await response.text()
    throw new Error(
      `Keeper Data API error ${response.status} for ${path}: ${responseBody}`
    )
  }

  // Some POST endpoints return 204 No Content
  if (response.status === 204) {
    return { success: true }
  }

  return response.json()
}

export async function getSites(params = {}) {
  return apiGet('/api/sites', params)
}

export async function getSiteById(id) {
  return apiGet(`/api/sites/${encodeURIComponent(id)}`)
}

export async function getParties(params = {}) {
  const result = await apiGet('/api/parties', params)

  // Map communication array to extract primary contact email
  if (result.values) {
    result.values = result.values.map((party) => ({
      ...party,
      email:
        party.communication?.find((c) => c.primaryContactFlag)?.email ||
        party.communication?.[0]?.email ||
        null
    }))
  }

  return result
}

export async function getPartyById(id) {
  return apiGet(`/api/parties/${encodeURIComponent(id)}`)
}

export async function getCountries(params = {}) {
  return apiGet('/api/countries', params)
}

export async function getCountryById(id) {
  return apiGet(`/api/countries/${encodeURIComponent(id)}`)
}

// System Maintenance - Collections
export async function deleteCollection(collectionName) {
  return apiDelete(
    `/api/import/collections/${encodeURIComponent(collectionName)}`
  )
}

export async function deleteAllCollections() {
  return apiDelete('/api/import/collections')
}

// System Maintenance - Reporting Collections
export async function deleteReportingCollection(collectionName) {
  return apiDelete(
    `/api/import/reporting-collections/${encodeURIComponent(collectionName)}`
  )
}

export async function deleteAllReportingCollections() {
  return apiDelete('/api/import/reporting-collections')
}

// System Maintenance - Storage
export async function clearInternalStorage(sourceType) {
  return apiDelete('/api/import/internal-storage', { sourceType })
}

// System Maintenance - Cleanse Data
export async function deleteCleanseData() {
  return apiPost('/api/cleanse/delete-data')
}

export async function deleteCleanseMetadata() {
  return apiPost('/api/cleanse/delete-metadata')
}
