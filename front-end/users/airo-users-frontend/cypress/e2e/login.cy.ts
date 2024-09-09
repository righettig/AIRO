describe('Login Page', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('/login');
  });

  it('should display the login form and all required elements', () => {
    // Check if the form exists
    cy.get('form').should('exist');
    cy.get('app-predefined-user-selection').should('exist');
    cy.get('app-email-input').should('exist');
    cy.get('app-password-input').should('exist');
    cy.get('.login-btn').should('exist');
    cy.get('.signup-link').should('exist');
  });

  it('should disable the login button when form is invalid', () => {
    // Initially, the button should be disabled
    cy.get('.login-btn').should('be.disabled');
  });

  it('should enable login button when form is valid', () => {
    // Enter valid email and password
    cy.get('app-email-input input').type('test1@airo.com');
    cy.get('app-password-input input').type('q1w2e3');

    // Check if the login button is enabled
    cy.get('.login-btn').should('not.be.disabled');
  });

  it('should show error message for invalid login attempt', () => {
    // Enter invalid email and password
    cy.get('app-email-input input').type('user1@example.com');
    cy.get('app-password-input input').type('InvalidPassword');

    // Click the login button
    cy.get('.login-btn').click();

    // Check if the error message is shown
    cy.get('app-error-message').should('exist');
  });

  // TODO: this probably fails because the front-end cannot talk to the gateway API
  // https://stackoverflow.com/questions/73195345/log-network-failures-in-cypress
  it('should redirect to the dashboard on successful login', () => {
    // Enter valid email and password
    cy.get('app-email-input input').type('test1@airo.com');
    cy.get('app-password-input input').type('q1w2e3');

    // Click the login button
    cy.get('.login-btn').click();

    // Check if redirected to home
    cy.url().should('include', '/home');
  });
});
