export const sourceFilesController = {
  handler(_request, h) {
    return h.view('data-tools/source-files/index', {
      pageTitle: 'Source Files',
      heading: 'Source Files',
      caption: 'Data Tools',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Tools', href: '/data-tools/reference-data' },
        { text: 'Source Files', href: '/data-tools/source-files' }
      ]
    })
  }
}
