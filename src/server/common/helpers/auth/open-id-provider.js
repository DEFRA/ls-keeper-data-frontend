import jwt from '@hapi/jwt'
import {
  AUTH_PROVIDERS
  //APP_SCOPES
} from '../../../common/constants/auth-constants.js'

export const createOpenIdProvider = (name, authConfig, oidcConf) => {
  return {
    name,
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: oidcConf.authorization_endpoint,
    token: oidcConf.token_endpoint,
    pkce: 'S256',
    scope: authConfig.scopes || ['openid', 'offline_access'],

    profile: async function (credentials, params, _get) {
      if (!credentials?.token) {
        throw new Error(
          `${name} Auth Access Token not present. Unable to retrieve profile.`
        )
      }

      const payload = jwt.token.decode(credentials.token).decoded.payload

      // Store common OAuth endpoints
      credentials.logoutUrl = oidcConf.end_session_endpoint
      credentials.tokenUrl = oidcConf.token_endpoint

      // Provider-specific profile processing
      if (credentials.provider === AUTH_PROVIDERS.DEFRA_ID) {
        // DEFRA ID specific JWT processing
        const displayName = [payload.firstName, payload.lastName]
          .filter((part) => part)
          .join(' ')

        credentials.externalSessionId = payload.sessionId
        credentials.profile = {
          id: payload.sub,
          correlationId: payload.correlationId,
          sessionId: payload.sessionId,
          contactId: payload.contactId,
          serviceId: payload.serviceId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          displayName,
          email: payload.email,
          uniqueReference: payload.uniqueReference,
          loa: payload.loa, // Level of Assurance
          aal: payload.aal, // Authentication Assurance Level
          enrolmentCount: payload.enrolmentCount,
          enrolmentRequestCount: payload.enrolmentRequestCount,
          currentRelationshipId: payload.currentRelationshipId,
          relationships: payload.relationships, // Organization relationships
          roles: payload.roles, // User roles/permissions
          idToken: params.id_token,
          // Store DEFRA ID specific data
          userType: payload.userType || 'citizen',
          organisationId: payload.currentRelationshipId
        }

        // TODO - Add organisation validation if required
        // checkOrganisation(payload.currentRelationshipId, payload.relationships)
      } else if (credentials.provider === AUTH_PROVIDERS.ENTRA_ID) {
        // Future Entra ID implementation
        const { groups = [] } = jwt.token.decode(params.id_token).decoded
          .payload

        credentials.externalSessionId = payload.sid
        credentials.idToken = params.id_token
        credentials.profile = {
          displayName: payload.name,
          email: payload.email,
          id: payload.sub,
          groups
        }
      } else {
        throw new Error(
          `Unexpected auth provider encountered: ${credentials.provider}`
        )
      }

      return credentials
    }
  }
}
