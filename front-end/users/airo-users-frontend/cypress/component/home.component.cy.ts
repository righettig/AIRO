import { HomeComponent } from '../../src/app/home/home.component'

describe('HomeComponent', () => {
  it('should mount', () => {
    cy.mount(HomeComponent)
  })
})