export const cleanseDataController = {
  handler(_request, h) {
    return h.view('system-maintenance/cleanse-data/index', {
      pageTitle: 'Cleanse Data',
      heading: 'Cleanse Data',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance/collections' },
        { text: 'Cleanse Data', href: '/system-maintenance/cleanse-data' }
      ]
    })
  }
}
