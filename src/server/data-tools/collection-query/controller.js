import { queryCollection } from '../../common/services/keeper-data-bridge-client.js'

const baseViewModel = {
  pageTitle: 'Collection Query',
  heading: 'Collection Query',
  caption: 'Data Tools',
  breadcrumbs: [
    { text: 'Home', href: '/' },
    { text: 'Data Tools', href: '/data-tools/reference-data' },
    { text: 'Collection Query', href: '/data-tools/collection-query' }
  ]
}

export const collectionQueryController = {
  async handler(request, h) {
    const { collection, $filter, $orderby, $select, $skip, $top, $count } =
      request.query

    const filters = { collection, $filter, $orderby, $select, $skip, $top, $count }
    const hasQuery = Boolean(collection)

    let result = null
    let error = null
    let dynamicColumns = []

    if (hasQuery) {
      try {
        const params = {}
        if ($filter) params.$filter = $filter
        if ($orderby) params.$orderby = $orderby
        if ($select) params.$select = $select
        if ($skip) params.$skip = $skip
        if ($top) params.$top = $top
        if ($count !== undefined) params.$count = $count

        result = await queryCollection(collection, params)

        if (result?.value?.length > 0) {
          dynamicColumns = Object.keys(result.value[0])
        }
      } catch (err) {
        error = `Failed to query collection: ${err.message}`
      }
    }

    return h.view('data-tools/collection-query/index', {
      ...baseViewModel,
      filters,
      hasQuery,
      result,
      error,
      dynamicColumns
    })
  }
}
