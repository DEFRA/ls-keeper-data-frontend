import { createServer } from '../../server.js'
import { statusCodes } from '../../common/constants/status-codes.js'

describe('#sourceFilesController', () => {
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
      url: '/data-tools/source-files',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining('Source Files | Keeper Reference Data Service')
    )
    expect(statusCode).toBe(statusCodes.ok)
  })
})
