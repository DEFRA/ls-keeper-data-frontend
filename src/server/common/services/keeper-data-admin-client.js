import fetch from 'node-fetch'
import { config } from '../../../config/config.js'
import { createLogger } from '../helpers/logging/logger.js'

const logger = createLogger()

function buildAdminAuthHeader() {
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

async function adminApiGet(path, queryParams = {}) {
  const baseUrl = config.get('keeperDataApi.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data Admin API GET request')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: buildAdminAuthHeader(),
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Keeper Data Admin API error ${response.status} for ${path}: ${body}`
    )
  }

  return response.json()
}

async function adminApiPost(path, queryParams = {}) {
  const baseUrl = config.get('keeperDataApi.baseUrl')
  const url = new URL(path, baseUrl)

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  logger.debug({ url: url.toString() }, 'Keeper Data Admin API POST request')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: buildAdminAuthHeader(),
      Accept: 'application/json'
    }
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Keeper Data Admin API error ${response.status} for ${path}: ${body}`
    )
  }

  return response.json()
}

/**
 * Get dead letter queue statistics
 * @returns {Promise<{approximateNumberOfMessages: number, approximateNumberOfMessagesNotVisible: number}>}
 */
export async function getDeadLetterQueueCount() {
  return adminApiGet('/api/admin/queues/deadletter/count')
}

/**
 * Peek at messages in the dead letter queue
 * @param {number} maxMessages - Maximum number of messages to retrieve (1-10)
 * @returns {Promise<{messages: Array, count: number}>}
 */
export async function getDeadLetterMessages(maxMessages = 5) {
  return adminApiGet('/api/admin/queues/deadletter/messages', { maxMessages })
}

/**
 * Redrive messages from dead letter queue back to main queue
 * @param {number} maxMessages - Maximum number of messages to redrive (1-100)
 * @returns {Promise<{processedCount: number, successCount: number, failureCount: number}>}
 */
export async function redriveDeadLetterMessages(maxMessages = 10) {
  return adminApiPost('/api/admin/queues/deadletter/redrive', { maxMessages })
}

/**
 * Purge all messages from the dead letter queue
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function purgeDeadLetterQueue() {
  return adminApiPost('/api/admin/queues/deadletter/purge')
}
