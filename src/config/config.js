import 'dotenv/config'
import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import convictFormatWithValidator from 'convict-format-with-validator'

// Debug: Check if environment variables are loaded
console.log('🔧 Environment Variables Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  AUTH_USERNAME: process.env.AUTH_USERNAME,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  AUTH_SERVICE_NAME: process.env.AUTH_SERVICE_NAME
})

const dirname = path.dirname(fileURLToPath(import.meta.url))

const fourHoursMs = 14400000
const oneWeekMs = 604800000

const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = process.env.NODE_ENV === 'development'

convict.addFormats(convictFormatWithValidator)

export const config = convict({
  serviceVersion: {
    doc: 'The service version, this variable is injected into your docker container in CDP environments',
    format: String,
    nullable: true,
    default: null,
    env: 'SERVICE_VERSION'
  },
  host: {
    doc: 'The IP address to bind',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'HOST'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeekMs,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'Keeper Reference Data Service'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: isDevelopment
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: isTest
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: process.env.NODE_ENV !== 'test',
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    },
    redact: {
      doc: 'Log paths to redact',
      format: Array,
      default: isProduction
        ? ['req.headers.authorization', 'req.headers.cookie', 'res.headers']
        : []
    }
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'HTTP_PROXY'
  },
  isSecureContextEnabled: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  session: {
    cache: {
      engine: {
        doc: 'backend cache is written to',
        format: ['redis', 'memory'],
        default: isProduction ? 'redis' : 'memory',
        env: 'SESSION_CACHE_ENGINE'
      },
      name: {
        doc: 'server side session cache name',
        format: String,
        default: 'session',
        env: 'SESSION_CACHE_NAME'
      },
      ttl: {
        doc: 'server side session cache ttl',
        format: Number,
        default: fourHoursMs,
        env: 'SESSION_CACHE_TTL'
      }
    },
    cookie: {
      ttl: {
        doc: 'Session cookie ttl',
        format: Number,
        default: fourHoursMs,
        env: 'SESSION_COOKIE_TTL'
      },
      password: {
        doc: 'session cookie password',
        format: String,
        default: 'the-password-must-be-at-least-32-characters-long',
        env: 'SESSION_COOKIE_PASSWORD',
        sensitive: true
      },
      secure: {
        doc: 'set secure flag on cookie',
        format: Boolean,
        default: isProduction,
        env: 'SESSION_COOKIE_SECURE'
      }
    }
  },
  redis: {
    host: {
      doc: 'Redis cache host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_HOST'
    },
    username: {
      doc: 'Redis cache username',
      format: String,
      default: '',
      env: 'REDIS_USERNAME'
    },
    password: {
      doc: 'Redis cache password',
      format: '*',
      default: '',
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    keyPrefix: {
      doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
      format: String,
      default: 'ls-keeper-data-frontend:',
      env: 'REDIS_KEY_PREFIX'
    },
    useSingleInstanceCache: {
      doc: 'Connect to a single instance of redis instead of a cluster.',
      format: Boolean,
      default: !isProduction,
      env: 'USE_SINGLE_INSTANCE_CACHE'
    },
    useTLS: {
      doc: 'Connect to redis using TLS',
      format: Boolean,
      default: isProduction,
      env: 'REDIS_TLS'
    }
  },
  appBaseUrl: {
    doc: 'Application base URL for after we signIn',
    format: String,
    default: 'http://localhost:3000',
    env: 'APP_BASE_URL'
  },
  auth: {
    defraId: {
      oidcConfigurationUrl: {
        doc: 'DEFRA ID OIDC Configuration URL',
        format: String,
        default:
          'http://localhost:3200/cdp-defra-id-stub/.well-known/openid-configuration',
        env: 'AUTH_DEFRA_ID_OIDC_CONFIGURATION_URL'
      },
      redirectUri: {
        doc: 'DEFRA ID Redirect URI',
        format: String,
        default: 'http://localhost:3000/signin-oidc',
        env: 'AUTH_DEFRA_ID_REDIRECT_URI'
      },
      clientId: {
        doc: 'DEFRA ID Client ID',
        format: String,
        default: '63983fc2-cfff-45bb-8ec2-959e21062b9a',
        env: 'AUTH_DEFRA_ID_CLIENT_ID'
      },
      clientSecret: {
        doc: 'DEFRA ID Client Secret',
        format: String,
        default: 'test_value',
        env: 'AUTH_DEFRA_ID_CLIENT_SECRET',
        sensitive: true
      },
      serviceId: {
        doc: 'DEFRA ID Service ID',
        format: String,
        default: 'd7d72b79-9c62-ee11-8df0-000d3adf7047',
        env: 'AUTH_DEFRA_ID_SERVICE_ID'
      },
      scopes: {
        doc: 'DEFRA ID OAuth scopes',
        format: Array,
        default: ['openid', 'offline_access'],
        env: 'AUTH_DEFRA_ID_SCOPES'
      },
      organisations: {
        doc: 'DEFRA ID allowed organisations',
        format: Array,
        default: [],
        env: 'AUTH_DEFRA_ID_ORGANISATIONS'
      }
    },
    // Future providers can be added here:
    // entraId: {
    //   oidcConfigurationUrl: {
    //     doc: 'Entra ID OIDC Configuration URL',
    //     format: String,
    //     env: 'AUTH_ENTRA_ID_OIDC_CONFIGURATION_URL',
    //     default: 'https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration'
    //   },
    //   clientId: {
    //     doc: 'Entra ID Client ID',
    //     format: String,
    //     env: 'AUTH_ENTRA_ID_CLIENT_ID',
    //     default: ''
    //   },
    //   clientSecret: {
    //     doc: 'Entra ID Client Secret',
    //     format: String,
    //     sensitive: true,
    //     env: 'AUTH_ENTRA_ID_CLIENT_SECRET',
    //     default: ''
    //   },
    //   scopes: {
    //     doc: 'Entra ID OAuth scopes',
    //     format: Array,
    //     default: ['openid', 'offline_access'],
    //     env: 'AUTH_ENTRA_ID_SCOPES'
    //   },
    //   groups: {
    //     doc: 'Entra ID user groups',
    //     format: Array,
    //     default: [],
    //     env: 'AUTH_ENTRA_ID_SECURITY_GROUPS'
    //   },
    //   adminGroupId: {
    //     doc: 'Entra ID admin security group identifier',
    //     format: String,
    //     default: '',
    //     env: 'AUTH_ENTRA_ID_ADMIN_GROUP_ID'
    //   }
    // },

    // Simple username/password authentication (ACTIVE)
    simple: {
      enabled: {
        doc: 'Enable simple username/password authentication',
        format: Boolean,
        default: true,
        env: 'AUTH_SIMPLE_ENABLED'
      },
      username: {
        doc: 'Authentication username',
        format: String,
        env: 'AUTH_USERNAME',
        default: 'admin',
        sensitive: true
      },
      password: {
        doc: 'Authentication password',
        format: String,
        env: 'AUTH_PASSWORD',
        default: 'changeme123',
        sensitive: true
      },
      serviceName: {
        doc: 'Service display name for sessions',
        format: String,
        default: 'LS Keeper Data Frontend',
        env: 'AUTH_SERVICE_NAME'
      }
    },

    origins: {
      doc: 'Auth provider origins for CSP header',
      format: Array,
      default: []
    }
  },
  nunjucks: {
    watch: {
      doc: 'Reload templates when they are changed.',
      format: Boolean,
      default: isDevelopment
    },
    noCache: {
      doc: 'Use a cache and recompile templates each time',
      format: Boolean,
      default: isDevelopment
    }
  },
  tracing: {
    header: {
      doc: 'Which header to track',
      format: String,
      default: 'x-cdp-request-id',
      env: 'TRACING_HEADER'
    }
  }
})

config.validate({ allowed: 'strict' })
