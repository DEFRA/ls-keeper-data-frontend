export const recordLineageController = {
  handler(_request, h) {
    return h.view('ingestion/record-lineage/index', {
      pageTitle: 'Record Lineage',
      heading: 'Record Lineage',
      caption: 'Ingestion',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Ingestion', href: '/ingestion/pipeline' },
        { text: 'Record Lineage', href: '/ingestion/record-lineage' }
      ]
    })
  }
}
