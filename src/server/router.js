import inert from '@hapi/inert'

import { home } from './home/index.js'
import { about } from './about/index.js'
import { health } from './health/index.js'
import { auth } from './auth/index.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'
import { dataTools } from './data-tools/index.js'
import { ingestion } from './ingestion/index.js'
import { dataQuality } from './data-quality/index.js'
import { systemMaintenance } from './system-maintenance/index.js'

export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Authentication routes
      await server.register([auth])

      // Application specific routes, add your own routes here
      await server.register([home, about])

      // Feature routes
      await server.register([dataTools, ingestion, dataQuality, systemMaintenance])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}
