export const collectionQueryController = {
  handler(_request, h) {
    return h.view('data-tools/collection-query/index', {
      pageTitle: 'Collection Query',
      heading: 'Collection Query',
      caption: 'Data Tools',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Tools', href: '/data-tools/reference-data' },
        { text: 'Collection Query', href: '/data-tools/collection-query' }
      ]
    })
  }
}
