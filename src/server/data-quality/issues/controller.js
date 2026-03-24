export const issuesController = {
  handler(_request, h) {
    return h.view('data-quality/issues/index', {
      pageTitle: 'Issues',
      heading: 'Issues',
      caption: 'Data Quality',
      breadcrumbs: [
        { text: 'Home', href: '/' },
        { text: 'Data Quality', href: '/data-quality/analysis-runs' },
        { text: 'Issues', href: '/data-quality/issues' }
      ]
    })
  }
}
