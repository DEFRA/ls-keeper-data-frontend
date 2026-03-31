import { createServer } from '../../server.js'
import { statusCodes } from '../../common/constants/status-codes.js'

describe('#importReportsController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/ingestion/import-reports',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining('Import Reports | Keeper Reference Data Service')
    )
    expect(statusCode).toBe(statusCodes.ok)
  })
})
