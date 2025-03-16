// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Create a command to handle admin login
Cypress.Commands.add('login', (username, password) =>
{
    // Intercept the auth calls
    cy.intercept('POST', '/api/auth/auth').as('loginRequest')
    cy.intercept('GET', '/api/auth/check-auth').as('checkAuth')

    // Visit home page
    cy.visit('/')

    // Find admin login link/button and click it
    cy.get('a[href*="admin"], button[aria-label*="admin"]').first().click()

    // Enter credentials
    cy.get('input[type="text"], input[name="username"]').type(username)
    cy.get('input[type="password"], input[name="password"]').type(password)

    // Submit login form
    cy.get('button[type="submit"]').click()

    // Wait for the login request to complete
    cy.wait('@loginRequest')
})

// Command to simulate image upload
Cypress.Commands.add('uploadFile', { prevSubject: 'element' }, (subject, fileName, fileType = 'image/jpeg') =>
{
    // Create a test file with the specified filename
    cy.fixture(fileName).then(fileContent =>
    {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, fileType)
        const testFile = new File([blob], fileName, { type: fileType })
        const dataTransfer = new DataTransfer()

        dataTransfer.items.add(testFile)
        const input = subject[0]
        input.files = dataTransfer.files

        return cy.wrap(subject).trigger('change', { force: true })
    })
}) 