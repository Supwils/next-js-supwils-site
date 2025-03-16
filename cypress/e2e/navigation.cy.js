describe('Site Navigation', () =>
{
    beforeEach(() =>
    {
        // Visit the home page before each test
        cy.visit('/')
    })

    it('should navigate to the Blog page', () =>
    {
        // Find the Blog navigation link and click it
        cy.get('nav')
            .contains('Blog', { matchCase: false })
            .click()

        // URL should change to the Blog page
        cy.url().should('include', '/Blog')

        // Blog page container should be visible
        cy.get('[class*="blog_container"]').should('be.visible')
    })

    it('should navigate to the Projects page', () =>
    {
        // Find the Projects navigation link and click it
        cy.get('nav')
            .contains('Project', { matchCase: false })
            .click()

        // URL should change to the Projects page
        cy.url().should('include', '/Project')

        // Projects page content should be visible
        cy.get('[class*="project_container"]').should('exist')
    })

    it('should navigate back to home from another page', () =>
    {
        // First navigate to Blog
        cy.get('nav')
            .contains('Blog', { matchCase: false })
            .click()

        // Then find the Home link and click it
        cy.get('nav')
            .contains('Home', { matchCase: false })
            .click()

        // URL should be the homepage
        cy.url().should('not.include', '/Blog')
        cy.url().should('not.include', '/Project')

        // Home page content should be visible
        cy.get('body').should('exist')
    })
}) 