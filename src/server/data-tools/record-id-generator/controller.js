export const recordIdGeneratorController = {
  handler(_request, h) {
    return h.view('data-tools/record-id-generator/index', {
      pageTitle: 'Record ID Generator',
      heading: 'Record ID Generator',
      caption: 'Data Tools',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Tools', href: '/data-tools/reference-data' },
        { text: 'Record ID Generator', href: '/data-tools/record-id-generator' }
      ]
    })
  }
}
