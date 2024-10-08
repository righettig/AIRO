import { CountdownComponent } from "../../src/app/common/components/countdown/countdown.component"

describe('CountdownComponent', () => {
  it('should mount', () => {
    cy.mount(CountdownComponent)
  })
})