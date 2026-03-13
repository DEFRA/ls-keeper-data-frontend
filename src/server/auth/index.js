import joi from 'joi'
import { validateCredentials } from '../common/helpers/auth/simple-auth.js'

export const auth = {
  plugin: {
    name: 'auth-routes',
    register: async function (server) {
      // GET /auth/login - Show login form
      server.route({
        method: 'GET',
        path: '/auth/login',
        handler: async (request, h) => {
          // If already authenticated, redirect to home
          if (request.auth.isAuthenticated) {
            return h.redirect('/')
          }

          const formErrors = request.yar.flash('formErrors')[0] || {}
          const username = request.yar.flash('username')[0] || ''

          return h.view('auth/login', {
            formErrors,
            username
          })
        },
        options: {
          auth: {
            mode: 'try'
          }
        }
      })

      // POST /auth/login - Handle login form submission
      server.route({
        method: 'POST',
        path: '/auth/login',
        handler: async (request, h) => {
          const { username, password } = request.payload

          // Validate credentials against environment variables
          const user = validateCredentials(username, password)

          if (!user) {
            // Authentication failed
            request.yar.flash('formErrors', {
              username: 'Invalid username or password'
            })
            request.yar.flash('username', username)
            return h.redirect('/auth/login')
          }

          // Authentication successful - create session
          request.cookieAuth.set(user)

          // Redirect to intended destination or home
          const redirectTo = request.yar.flash('redirectTo')[0] || '/'
          return h.redirect(redirectTo)
        },
        options: {
          auth: {
            mode: 'try'
          },
          validate: {
            payload: joi.object({
              username: joi.string().required().messages({
                'any.required': 'Enter your username',
                'string.empty': 'Enter your username'
              }),
              password: joi.string().required().messages({
                'any.required': 'Enter your password',
                'string.empty': 'Enter your password'
              })
            }),
            failAction: (request, h, error) => {
              const formErrors = {}
              
              error.details.forEach((detail) => {
                formErrors[detail.path[0]] = detail.message
              })
              
              request.yar.flash('formErrors', formErrors)
              request.yar.flash('username', request.payload?.username || '')
              return h.redirect('/auth/login').takeover()
            }
          }
        }
      })

      // GET /auth/logout - Handle logout
      server.route({
        method: 'GET',
        path: '/auth/logout',
        handler: async (request, h) => {
          request.cookieAuth.clear()
          return h.redirect('/auth/login')
        }
      })

      // GET /auth/profile - Show user profile (for testing)
      server.route({
        method: 'GET',
        path: '/auth/profile',
        handler: async (request, h) => {
          return {
            user: request.auth.credentials,
            authenticated: request.auth.isAuthenticated,
            session: request.auth.artifacts
          }
        },
        options: {
          auth: 'simple-session'
        }
      })

      // === COMMENTED OUT: OAuth/DEFRA ID routes (preserved for reference) ===

      /*
      // OAuth callback route (DEFRA ID)
      server.route({
        method: 'GET',
        path: '/signin-oidc',
        handler: async (request, h) => {
          const { credentials } = request.auth
          
          if (!credentials || !credentials.profile) {
            server.log(['error', 'auth'], 'No credentials received from DEFRA ID')
            return h.redirect('/auth/login?error=auth_failed')
          }

          // Store user in session
          request.yar.set('user', {
            id: credentials.profile.id,
            email: credentials.profile.email,
            displayName: credentials.profile.displayName,
            firstName: credentials.profile.firstName,
            lastName: credentials.profile.lastName,
            contactId: credentials.profile.contactId,
            serviceId: credentials.profile.serviceId,
            enrolmentCount: credentials.profile.enrolmentCount,
            relationships: credentials.profile.relationships,
            roles: credentials.profile.roles
          })

          server.log(['info', 'auth'], `User ${credentials.profile.email} logged in successfully`)

          // Redirect to home or intended destination
          const redirectTo = request.yar.flash('redirectTo') || '/'
          return h.redirect(redirectTo)
        },
        options: {
          auth: {
            strategy: 'defra-id'
          }
        }
      })
      */

      server.log(['info', 'auth'], 'Simple authentication routes registered')
    }
  }
}
