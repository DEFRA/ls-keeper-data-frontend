export const pipelineController = {
  handler(_request, h) {
    return h.view('ingestion/pipeline/index', {
      pageTitle: 'Pipeline',
      heading: 'Pipeline',
      caption: 'Ingestion',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Ingestion', href: '/ingestion/pipeline' }
      ]
    })
  }
}
