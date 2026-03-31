import { createServer } from '../../server.js'
import { statusCodes } from '../../common/constants/status-codes.js'

describe('#referenceDataController', () => {
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
      url: '/data-tools/reference-data',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining('Reference Data | Keeper Reference Data Service')
    )
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should handle sites query', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=sites&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(expect.stringContaining('Reference Data'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should handle parties query', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=parties&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(expect.stringContaining('Reference Data'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should handle countries query', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=countries&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(expect.stringContaining('Reference Data'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should reject invalid GUID in keeper party ID', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=sites&keeperPartyId=invalid-guid-123',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(
      expect.stringContaining(
        'Keeper party ID must be a valid GUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)'
      )
    )
    expect(result).toEqual(expect.stringContaining('There is a problem'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should accept valid GUID in keeper party ID', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=sites&keeperPartyId=550e8400-e29b-41d4-a716-446655440000',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).not.toEqual(expect.stringContaining('There is a problem'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should display email column in parties results', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=parties&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    expect(result).toEqual(expect.stringContaining('Email'))
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should not display State column in parties results', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=parties&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    // Check the table doesn't have State header (should have Email instead)
    const stateHeaderMatch = result.match(
      /<th[^>]*>State<\/th>[\s\S]*?<th[^>]*>Last updated<\/th>/
    )
    expect(stateHeaderMatch).toBeFalsy()
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('Should not display State or Source columns in sites results', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/data-tools/reference-data?type=sites&page=1',
      auth: {
        strategy: 'simple-cookie',
        credentials: {
          username: 'admin',
          displayName: 'Administrator'
        }
      }
    })

    // Check the table doesn't have State or Source headers
    const stateHeaderMatch = result.match(/<th[^>]*>State<\/th>/)
    const sourceHeaderMatch = result.match(/<th[^>]*>Source<\/th>/)
    expect(stateHeaderMatch).toBeFalsy()
    expect(sourceHeaderMatch).toBeFalsy()
    expect(statusCode).toBe(statusCodes.ok)
  })
})
