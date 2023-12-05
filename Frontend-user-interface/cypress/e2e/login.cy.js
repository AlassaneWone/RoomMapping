describe('Connection flow', () => {
    it('should navigate to login page, fill in the form, and redirect to home on success', () => {
        // Visitez la page d'accueil
        cy.visit('/');

        // Vérifiez que le bouton "Se connecter" est visible
        cy.get('.Button').contains('Se connecter').should('be.visible');

        // Cliquez sur le bouton "Se connecter"
        cy.get('.Button').contains('Se connecter').click();

        // Vérifiez que vous êtes redirigé vers la page de connexion
        cy.url().should('include', '/login');

        // Remplissez le champ email
        cy.get('input[name=email]').type('TestAccount@gmail.com');

        // Remplissez le champ mot de passe
        cy.get('input[name=password]').type('TestAccount12');

        // Cliquez sur le bouton "Se connecter" pour soumettre le formulaire
        cy.get('button[type=submit]').click();

        // Vérifiez que vous êtes redirigé vers la page d'accueil après une connexion réussie
        cy.url().should('include', '/');
    });
});