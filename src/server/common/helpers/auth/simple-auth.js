import crypto from 'node:crypto'
import cookie from '@hapi/cookie'
import { config } from '../../../../config/config.js'

export const simpleAuth = {
  plugin: {
    name: 'simple-auth',
    register: async function (server) {
      const authConfig = config.get('auth.simple')
      const sessionConfig = config.get('session')

      // Register cookie authentication
      await server.register(cookie)

      // Set up session validation with unique cookie name
      server.auth.strategy('simple-session', 'cookie', {
        cookie: {
          name: 'simple-auth-session', // Different name to avoid conflict
          path: '/',
          password: sessionConfig.cookie.password,
          isSecure: sessionConfig.cookie.secure,
          ttl: sessionConfig.cookie.ttl
        },
        keepAlive: true,
        validate: async (request, session) => {
          // Simple validation - check if session exists and is valid
          if (session && session.authenticated) {
            return { isValid: true, credentials: session }
          }
          return { isValid: false }
        }
      })

      // Set default auth strategy
      server.auth.default('simple-session')

      server.log(
        ['info', 'auth'],
        `Simple authentication configured for service: ${authConfig.serviceName}`
      )
    }
  }
}

// Hash password for comparison (simple implementation)
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

//Validate user credentials against environment variables
export const validateCredentials = (username, password) => {
  const authConfig = config.get('auth.simple')

  const expectedUsername = authConfig.username
  const expectedPassword = authConfig.password

  // Debug logging to see what credentials are being compared
  console.log('🔐 Auth Debug:', {
    providedUsername: username,
    providedPassword: password,
    expectedUsername,
    expectedPassword,
    match: username === expectedUsername && password === expectedPassword
  })

  // Simple string comparison (consider adding timing-safe comparison for production)
  if (username === expectedUsername && password === expectedPassword) {
    return {
      id: 'service-user',
      displayName: authConfig.serviceName,
      email: 'service@localhost',
      authenticated: true,
      authMethod: 'simple',
      loginTime: new Date().toISOString()
    }
  }

  return null
}
