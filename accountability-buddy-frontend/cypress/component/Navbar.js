import React from 'react'
import Navbar from '../../src/Navbar'

describe('<Navbar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Navbar />)
  })
})