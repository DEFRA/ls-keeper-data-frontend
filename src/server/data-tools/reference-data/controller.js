import {
  getSites,
  getParties,
  getCountries
} from '../../common/services/keeper-data-api-client.js'
import { createLogger } from '../../common/helpers/logging/logger.js'

const logger = createLogger()
const VALID_TYPES = ['sites', 'parties', 'countries']
const DEFAULT_PAGE_SIZE = 10

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidGuid(value) {
  return !value || GUID_REGEX.test(value.trim())
}

function buildPageUrl(request, page) {
  const params = new URLSearchParams(request.query)
  params.set('page', page)
  return `${request.path}?${params.toString()}`
}

function buildPagination(page, totalPages, request) {
  if (totalPages <= 1) return null

  const items = []
  const seen = new Set()

  for (let i = 1; i <= totalPages; i++) {
    const nearCurrent = i >= page - 2 && i <= page + 2
    const isEdge = i === 1 || i === totalPages

    if (isEdge || nearCurrent) {
      items.push({
        number: i,
        href: buildPageUrl(request, i),
        current: i === page
      })
      seen.add(i)
    }
  }

  const withEllipsis = []
  items.forEach((item, idx) => {
    if (idx > 0 && item.number - items[idx - 1].number > 1) {
      withEllipsis.push({ ellipsis: true })
    }
    withEllipsis.push(item)
  })

  return {
    previous: page > 1 ? { href: buildPageUrl(request, page - 1) } : undefined,
    next:
      page < totalPages ? { href: buildPageUrl(request, page + 1) } : undefined,
    items: withEllipsis
  }
}

export const referenceDataController = {
  async handler(request, h) {
    const query = request.query
    const activeType = VALID_TYPES.includes(query.type) ? query.type : 'sites'
    const page = Math.max(1, parseInt(query.page, 10) || 1)
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(query.pageSize, 10) || DEFAULT_PAGE_SIZE)
    )

    let result = null
    let error = null
    let validationErrors = {}

    // Validate keeper party ID is a valid GUID
    if (activeType === 'sites' && query.keeperPartyId) {
      if (!isValidGuid(query.keeperPartyId)) {
        validationErrors.keeperPartyId =
          'Keeper party ID must be a valid GUID format (e.g., 550e8400-e29b-41d4-a716-446655440000)'
      }
    }

    const hasFilters =
      (activeType === 'sites' &&
        (query.siteIdentifier ||
          query.siteType ||
          query.keeperPartyId ||
          query.lastUpdatedDate)) ||
      (activeType === 'parties' &&
        (query.firstName ||
          query.lastName ||
          query.email ||
          query.lastUpdatedDate)) ||
      (activeType === 'countries' &&
        (query.name ||
          query.code ||
          query.devolvedAuthority ||
          query.euTradeMember ||
          query.lastUpdatedDate))

    if (
      (hasFilters || query.page) &&
      Object.keys(validationErrors).length === 0
    ) {
      try {
        if (activeType === 'sites') {
          result = await getSites({
            siteIdentifier: query.siteIdentifier,
            type: query.siteType,
            keeperPartyId: query.keeperPartyId,
            lastUpdatedDate: query.lastUpdatedDate,
            page,
            pageSize
          })
        } else if (activeType === 'parties') {
          result = await getParties({
            firstName: query.firstName,
            lastName: query.lastName,
            email: query.email,
            lastUpdatedDate: query.lastUpdatedDate,
            page,
            pageSize
          })
        } else {
          result = await getCountries({
            name: query.name,
            code: query.code ? query.code.trim().toUpperCase() : undefined,
            devolvedAuthority: query.devolvedAuthority,
            euTradeMember: query.euTradeMember,
            lastUpdatedDate: query.lastUpdatedDate,
            page,
            pageSize
          })
        }
      } catch (err) {
        logger.error({ err }, `Reference Data: failed to fetch ${activeType}`)
        error = `Unable to retrieve ${activeType}. The API may be unavailable.`
      }
    }

    const totalPages = result
      ? Math.ceil((result.totalCount || 0) / pageSize)
      : 0

    return h.view('data-tools/reference-data/index', {
      pageTitle: 'Reference Data',
      heading: 'Reference Data',
      caption: 'Data Tools',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Tools', href: '/data-tools/reference-data' }
      ],
      activeType,
      result,
      error,
      validationErrors,
      filters: query,
      page,
      pageSize,
      totalPages,
      hasFilters,
      pagination: buildPagination(page, totalPages, request)
    })
  }
}
