export const reportingCollectionsController = {
  handler(_request, h) {
    return h.view('system-maintenance/reporting-collections/index', {
      pageTitle: 'Reporting Collections',
      heading: 'Reporting Collections',
      caption: 'System Maintenance',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'System Maintenance', href: '/system-maintenance/collections' },
        {
          text: 'Reporting Collections',
          href: '/system-maintenance/reporting-collections'
        }
      ]
    })
  }
}
