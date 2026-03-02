import bell from '@hapi/bell'
import { config } from '../../../../config/config.js'
import { createOpenIdProvider } from './open-id-provider.js'
import { getOpenIdConfig } from './open-id-client.js'
import { AUTH_PROVIDERS } from '../../../common/constants/auth-constants.js'

export const defraIdAuth = {
  plugin: {
    name: 'defra-id-auth',
    register: async function (server) {
      const authConfig = config.get('auth.defraId')
      const sessionConfig = config.get('session')
      const appBaseUrl = config.get('appBaseUrl')

      // Register required dependencies
      await server.register([bell])

      // Fetch OIDC configuration using new client
      let oidcConf
      try {
        oidcConf = await getOpenIdConfig(authConfig.oidcConfigurationUrl)
      } catch (error) {
        server.log(
          ['error', 'auth'],
          `Failed to load OIDC configuration: ${error.message}`
        )
        throw error
      }

      // Create DEFRA ID provider using generic factory
      const provider = createOpenIdProvider(
        AUTH_PROVIDERS.DEFRA_ID,
        {
          ...authConfig,
          scopes: authConfig.scopes || ['openid', 'offline_access']
        },
        oidcConf
      )

      // Register DEFRA ID OAuth2 strategy with PKCE
      server.auth.strategy('defra-id', 'bell', {
        provider,
        password: sessionConfig.cookie.password,
        clientId: authConfig.clientId,
        clientSecret: authConfig.clientSecret,
        location: (request) => {
          // Store referrer for post-login redirect
          const redirectTo = request.query.redirectTo || '/'
          request.yar.flash('redirectTo', redirectTo)

          return `${appBaseUrl}/signin-oidc`
        },
        cookie: 'bell-defra-id',
        isSecure: sessionConfig.cookie.secure,
        providerParams: {
          serviceId: authConfig.serviceId
        }
      })

      server.log(
        ['info', 'auth'],
        'Enhanced DEFRA ID authentication configured successfully'
      )
    }
  }
}
