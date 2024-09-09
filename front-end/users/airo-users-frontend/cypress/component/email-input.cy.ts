import { mount } from 'cypress/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EmailInputComponent } from '../../src/app/auth/components/common/email-input.component';

describe('EmailInputComponent', () => {
    it('renders and shows required error', () => {
        const email = new FormControl('');

        mount(EmailInputComponent, {
            componentProperties: {
                email: email
            },
            imports: [ReactiveFormsModule, MatInputModule, MatIconModule]
        });

        cy.get('input').focus().blur();
        cy.get('mat-error span').should('contain.text', 'Email is required');
    });

    it('shows invalid email error when email is incorrect', () => {
        const email = new FormControl('invalidEmail');

        mount(EmailInputComponent, {
            componentProperties: {
                email: email
            },
            imports: [ReactiveFormsModule, MatInputModule, MatIconModule]
        });

        cy.get('input').focus().blur();
        cy.get('mat-error span').should('contain.text', 'Please enter a valid email address');
    });

    it('does not show any error when email is valid', () => {
        const email = new FormControl('valid@example.com');

        mount(EmailInputComponent, {
            componentProperties: {
                email: email
            },
            imports: [ReactiveFormsModule, MatInputModule, MatIconModule]
        });

        cy.get('mat-error').should('not.exist');
    });
});
