/**
 * A GDS styled example home page controller.
 * Updated to work with simple username/password authentication.
 */
export const homeController = {
  handler(request, h) {
    // Get user from simple auth session
    const user = request.auth.isAuthenticated ? request.auth.credentials : null

    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'KRDS Dashboard',
      breadcrumbs: [{ text: 'Home', href: '/' }],
      user: user || null,
      isAuthenticated: request.auth.isAuthenticated
    })
  },
  options: {
    auth: {
      mode: 'try' // Allow both authenticated and unauthenticated access
    }
  }
}
