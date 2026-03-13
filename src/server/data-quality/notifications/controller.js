export const notificationsController = {
  handler(_request, h) {
    return h.view('data-quality/notifications/index', {
      pageTitle: 'Notifications',
      heading: 'Notifications',
      caption: 'Data Quality',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Quality', href: '/data-quality/analysis-runs' },
        { text: 'Notifications', href: '/data-quality/notifications' }
      ]
    })
  }
}
