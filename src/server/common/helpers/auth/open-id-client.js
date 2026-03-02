import { createLogger } from '../logging/logger.js'

const logger = createLogger()

export const getOpenIdConfig = async (oidcConfigurationUrl) => {
  logger.info(`Fetching OIDC configuration from: ${oidcConfigurationUrl}`)

  try {
    const response = await fetch(oidcConfigurationUrl)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OIDC config: ${response.status} ${response.statusText}`
      )
    }

    const oidcConfig = await response.json()

    logger.info('OIDC configuration fetched successfully', {
      authorization_endpoint: oidcConfig.authorization_endpoint,
      token_endpoint: oidcConfig.token_endpoint,
      end_session_endpoint: oidcConfig.end_session_endpoint
    })

    return oidcConfig
  } catch (error) {
    logger.error('Failed to fetch OIDC configuration', {
      error: error.message,
      oidcConfigurationUrl
    })
    throw error
  }
}
