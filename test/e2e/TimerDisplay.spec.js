describe('タイマーの表示', () => {
  it('初期アクセス時にタイマーの表示が00:00:01になっている', () => {
    cy.visit('/')
    cy.get('#timer').should('contain', "00:00:01")
  })
  it('タイマーを3秒にセットするとタイマーの表示が00:00:03になる', () => {
    cy.visit('/')
    cy.get('#input-time-sec')
      .clear()
      .type('3')
    cy.get('#timer').should('contain', "00:00:03")
  })
})