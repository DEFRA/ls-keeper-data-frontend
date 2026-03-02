import fetch from 'node-fetch'
import { config } from '../../../config/config.js'
import { createLogger } from '../helpers/logging/logger.js'

const logger = createLogger()

export async function getDefraIdAuthConfig(oidcConfigurationUrl) {
  try {
    const proxyUrl = config.get('httpProxy')

    const fetchOptions = {
      headers: {
        Accept: 'application/json'
      }
    }

    if (proxyUrl) {
      logger.info(`Using proxy: ${proxyUrl}`)
      // TODO - Add proxy support later if needed, e.g. using https-proxy-agent
    }

    const response = await fetch(oidcConfigurationUrl, fetchOptions)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OIDC configuration: ${response.status} ${response.statusText}`
      )
    }

    const payload = await response.json()
    logger.info('Successfully fetched DEFRA ID OIDC configuration')

    return payload
  } catch (error) {
    logger.error(
      { error, oidcConfigurationUrl },
      'Failed to fetch DEFRA ID OIDC configuration'
    )
    throw error
  }
}
