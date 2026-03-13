export function buildNavigation(request) {
  return [
    {
      text: 'Home',
      href: '/',
      current: request?.path === '/'
    },
    {
      text: 'About',
      href: '/about',
      current: request?.path === '/about'
    },
    {
      text: 'Data Tools',
      href: '/data-tools/reference-data',
      current: request?.path?.startsWith('/data-tools')
    },
    {
      text: 'Ingestion',
      href: '/ingestion/pipeline',
      current: request?.path?.startsWith('/ingestion')
    },
    {
      text: 'Data Quality',
      href: '/data-quality/analysis-runs',
      current: request?.path?.startsWith('/data-quality')
    },
    {
      text: 'System Maintenance',
      href: '/system-maintenance/collections',
      current: request?.path?.startsWith('/system-maintenance')
    }
  ]
}
