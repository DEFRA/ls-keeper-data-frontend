import { createServer } from '../../server.js'
import { statusCodes } from '../../common/constants/status-codes.js'

describe('#recordLineageController', () => {
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
      url: '/ingestion/record-lineage',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining('Record Lineage | Keeper Reference Data Service')
    )
    expect(statusCode).toBe(statusCodes.ok)
  })
})
