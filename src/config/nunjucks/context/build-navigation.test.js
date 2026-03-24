import { buildNavigation } from './build-navigation.js'

function mockRequest(options) {
  return { ...options }
}

const allNavItems = (overrides = {}) =>
  [
    { text: 'Home', href: '/', current: false },
    { text: 'Data Tools', href: '/data-tools/reference-data', current: false },
    { text: 'Ingestion', href: '/ingestion/pipeline', current: false },
    {
      text: 'Data Quality',
      href: '/data-quality/analysis-runs',
      current: false
    },
    {
      text: 'System Maintenance',
      href: '/system-maintenance',
      current: false
    },
    { text: 'About', href: '/about', current: false }
  ].map((item) =>
    item.text in overrides ? { ...item, current: overrides[item.text] } : item
  )

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(
      buildNavigation(
        mockRequest({
          path: '/non-existent-path',
          auth: { isAuthenticated: true }
        })
      )
    ).toEqual(allNavItems())
  })

  test('Should mark Home as current when on the home path', () => {
    expect(
      buildNavigation(
        mockRequest({ path: '/', auth: { isAuthenticated: true } })
      )
    ).toEqual(allNavItems({ Home: true }))
  })

  test('Should mark About as current when on the about path', () => {
    expect(
      buildNavigation(
        mockRequest({ path: '/about', auth: { isAuthenticated: true } })
      )
    ).toEqual(allNavItems({ About: true }))
  })

  test('Should mark Data Tools as current when on a data-tools path', () => {
    expect(
      buildNavigation(
        mockRequest({
          path: '/data-tools/reference-data',
          auth: { isAuthenticated: true }
        })
      )
    ).toEqual(allNavItems({ 'Data Tools': true }))
  })

  test('Should mark Ingestion as current when on an ingestion path', () => {
    expect(
      buildNavigation(
        mockRequest({
          path: '/ingestion/pipeline',
          auth: { isAuthenticated: true }
        })
      )
    ).toEqual(allNavItems({ Ingestion: true }))
  })

  test('Should mark Data Quality as current when on a data-quality path', () => {
    expect(
      buildNavigation(
        mockRequest({
          path: '/data-quality/issues',
          auth: { isAuthenticated: true }
        })
      )
    ).toEqual(allNavItems({ 'Data Quality': true }))
  })

  test('Should mark System Maintenance as current when on a system-maintenance path', () => {
    expect(
      buildNavigation(
        mockRequest({
          path: '/system-maintenance/storage',
          auth: { isAuthenticated: true }
        })
      )
    ).toEqual(allNavItems({ 'System Maintenance': true }))
  })
})
