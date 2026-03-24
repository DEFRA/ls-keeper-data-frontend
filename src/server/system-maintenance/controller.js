export const systemMaintenanceController = {
  handler(_request, h) {
    return h.view('system-maintenance/index', {
      pageTitle: 'System Maintenance',
      heading: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance' }
      ]
    })
  }
}
