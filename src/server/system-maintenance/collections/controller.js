export const collectionsController = {
  handler(_request, h) {
    return h.view('system-maintenance/collections/index', {
      pageTitle: 'Collections',
      heading: 'Collections',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance/collections' }
      ]
    })
  }
}
