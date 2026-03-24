export const importReportsController = {
  handler(_request, h) {
    return h.view('ingestion/import-reports/index', {
      pageTitle: 'Import Reports',
      heading: 'Import Reports',
      caption: 'Ingestion',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Ingestion', href: '/ingestion/pipeline' },
        { text: 'Import Reports', href: '/ingestion/import-reports' }
      ]
    })
  }
}
