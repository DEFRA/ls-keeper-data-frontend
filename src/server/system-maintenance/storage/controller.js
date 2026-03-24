export const storageController = {
  handler(_request, h) {
    return h.view('system-maintenance/storage/index', {
      pageTitle: 'Storage',
      heading: 'Storage',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance/collections' },
        { text: 'Storage', href: '/system-maintenance/storage' }
      ]
    })
  }
}
