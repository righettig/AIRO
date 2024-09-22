import { EventListComponent } from '../../src/app/events/components/event-list/event-list.component'

describe('EventListComponent', () => {
  it('should mount', () => {
    cy.mount(EventListComponent)
  })
})