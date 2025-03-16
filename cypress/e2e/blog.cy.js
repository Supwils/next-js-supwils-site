describe('Blog Page', () =>
{
    beforeEach(() =>
    {
        // Visit the blog page before each test
        cy.visit('/Blog')
    })

    it('displays the blog listing page', () =>
    {
        // The blog container should be visible
        cy.get('[class*="blog_container"]').should('exist')

        // Search bar should be present
        cy.get('input[type="text"]').should('exist')
    })

    it('should display blog posts or no posts message', () =>
    {
        // Either blog cards OR a "no posts" message should be visible
        cy.get('body').then(($body) =>
        {
            if ($body.find('[class*="blogCard"]').length > 0)
            {
                // If blog posts exist, check their structure
                cy.get('[class*="blogCard"]').first().within(() =>
                {
                    cy.get('[class*="title"]').should('exist')
                    cy.get('[class*="description"]').should('exist')
                })
            } else
            {
                // If no blog posts, check for the "no posts" message
                cy.contains('No blog posts available').should('be.visible')
            }
        })
    })

    it('should navigate to a blog post when clicked', () =>
    {
        cy.get('body').then(($body) =>
        {
            // Only run this test if blog posts are available
            if ($body.find('[class*="blogCard"]').length > 0)
            {
                cy.get('[class*="blogCard"]').first().click()

                // URL should change to a blog post
                cy.url().should('include', '/Blog/')

                // Blog content should load
                cy.get('[class*="post_container"]').should('exist')
            } else
            {
                // Skip this test if no blog posts are available
                cy.log('No blog posts available to test navigation')
            }
        })
    })
}) 