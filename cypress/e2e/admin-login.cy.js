describe('Admin Login', () =>
{
    beforeEach(() =>
    {
        // Visit the home page before each test
        cy.visit('/')

        // Intercept any auth requests
        cy.intercept('POST', '/api/auth/auth').as('loginRequest')
    })

    it('should display login modal when admin link is clicked', () =>
    {
        // Find the admin login link/button and click it
        // This is just a guess - you'll need to adjust based on your actual UI
        cy.get('a[href*="admin"], button[aria-label*="admin"]')
            .first()
            .click()

        // The modal should become visible
        cy.get('[class*="modal"], [class*="Modal"]').should('be.visible')
        cy.contains('Username').should('be.visible')
        cy.contains('Password').should('be.visible')
    })

    it('should show error message for invalid credentials', () =>
    {
        // First open the modal
        cy.get('a[href*="admin"], button[aria-label*="admin"]')
            .first()
            .click()

        // Intercept and mock a failed login
        cy.intercept('POST', '/api/auth/auth', {
            statusCode: 401,
            body: { success: false, message: 'Invalid username or password' }
        }).as('failedLogin')

        // Enter invalid credentials
        cy.get('input[type="text"], input[name="username"]').type('wronguser')
        cy.get('input[type="password"], input[name="password"]').type('wrongpassword')

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Wait for the request to complete
        cy.wait('@failedLogin')

        // Error message should be displayed
        cy.contains('Invalid username or password').should('be.visible')
    })

    it('should redirect to admin page after successful login', () =>
    {
        // First open the modal
        cy.get('a[href*="admin"], button[aria-label*="admin"]')
            .first()
            .click()

        // Intercept and mock a successful login
        cy.intercept('POST', '/api/auth/auth', {
            statusCode: 200,
            body: { success: true, message: 'Authentication successful' }
        }).as('successfulLogin')

        // Also intercept the check-auth request that might happen after login
        cy.intercept('GET', '/api/auth/check-auth', {
            statusCode: 200,
            body: { isAuthenticated: true, user: { username: 'admin', role: 'admin' } }
        }).as('checkAuth')

        // Enter valid credentials
        cy.get('input[type="text"], input[name="username"]').type('admin')
        cy.get('input[type="password"], input[name="password"]').type('test-password')

        // Submit the form
        cy.get('button[type="submit"]').click()

        // Wait for the request to complete
        cy.wait('@successfulLogin')

        // Either the modal should close or we should be redirected
        cy.get('[class*="modal"], [class*="Modal"]').should('not.exist')
            .or('not.be.visible')
    })
}) 