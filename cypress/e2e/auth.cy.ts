describe('Homepage', () => {
  it('should show logo', () => {
    cy.visit('/')
    cy.get('#logo').contains("Solana Grant")
  })
})
