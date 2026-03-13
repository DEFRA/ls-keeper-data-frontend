export const referenceDataController = {
  handler(_request, h) {
    return h.view('data-tools/reference-data/index', {
      pageTitle: 'Reference Data',
      heading: 'Reference Data',
      caption: 'Data Tools',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Tools', href: '/data-tools/reference-data' }
      ]
    })
  }
}
