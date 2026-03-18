import fetch from 'node-fetch'
import { config } from '../../../config/config.js'
import { createLogger } from '../helpers/logging/logger.js'

const logger = createLogger()

function buildBasicAuthHeader() {
  // Use password directly as base64-encoded credentials
  // (assumes password contains the base64 value, we prepend "Basic ")
  const password = config.get('keeperDataApi.password')
  return `Basic ${password}`
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
    const body = await response.text()
    throw new Error(
      `Keeper Data API error ${response.status} for ${path}: ${body}`
    )
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
  return apiGet('/api/parties', params)
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
