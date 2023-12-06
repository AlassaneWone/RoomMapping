describe('User Map Display', () => {
    it('should display the maps of the logged-in user in the MapList page', () => {
        // Stub the API call
        cy.intercept('GET', 'http://localhost:5000/api/map/*', { fixture: 'maps.json' }).as('getMaps');

        // Visit the home page
        cy.visit('/');

        // Verify that the "Mes cartes" button is visible
        cy.get('.Button').contains('Mes cartes').should('be.visible');

        // Click on the "Mes cartes" button
        cy.get('.Button').contains('Mes cartes').click();

        // Verify that you are redirected to the MapList component
        cy.url().should('include', '/maplist');

        // Verify that the API call was made
        cy.wait('@getMaps');

        // Verify that the map data is displayed correctly
        cy.get('img').should('be.visible');
    });
});