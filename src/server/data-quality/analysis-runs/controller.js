export const analysisRunsController = {
  handler(_request, h) {
    return h.view('data-quality/analysis-runs/index', {
      pageTitle: 'Analysis Runs',
      heading: 'Analysis Runs',
      caption: 'Data Quality',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Quality', href: '/data-quality/analysis-runs' }
      ]
    })
  }
}
