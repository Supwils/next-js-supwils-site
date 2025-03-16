describe('Home Page', () =>
{
    beforeEach(() =>
    {
        // Visit the home page before each test
        cy.visit('/')
    })

    it('displays the homepage with navigation', () =>
    {
        // Check if the navigation exists
        cy.get('nav').should('exist')

        // Check for a recognizable element on the homepage
        cy.contains('Huahao Shang').should('be.visible')
    })

    it('allows navigation to different sections', () =>
    {
        // Check that navigation links exist
        cy.get('nav a').should('have.length.at.least', 3)

        // Ensure navigation links are clickable
        cy.get('nav a').first().should('have.attr', 'href')
    })
}) 