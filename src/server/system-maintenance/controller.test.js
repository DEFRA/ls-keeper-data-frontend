import { createServer } from '../server.js'
import { statusCodes } from '../common/constants/status-codes.js'

describe('#systemMaintenanceController', () => {
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
      url: '/system-maintenance',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining('System Maintenance | Keeper Reference Data Service')
    )
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should display navigation cards', async () => {
    const { result } = await server.inject({
      method: 'GET',
      url: '/system-maintenance',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(expect.stringContaining('Dead Letter Queue'))
  })
})
