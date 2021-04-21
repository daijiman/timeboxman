describe('タイマーの表示', () => {
  it('Roomボタンをクリックしたら#room-id テキストボックスに10文字のRoomIdが入る', () => {
    cy.visit('/')
    cy.get('#room-button')
      .click()
    cy.get('#room-id').should((hoge) => {
      console.log(hoge)
      expect(hoge).to.have.lengthOf(10)
    })
    // cy.get('#room-id')
    //   .invoke('text')
    //   .should('have.length', 10)
  })
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

  it('タイマー完了状態は、タイマーの背景色が赤になる', () => {
    cy.visit('/')
    cy.get('#start-button')
      .click()
    cy.get('#timer').should('have.class', 'bg-red-200')
  })
  it('秒のテキストボックスに60を入力したとき59秒へ自動的に変わる', () => {
    cy.visit('/')
    cy.get('#input-time-sec')
      .clear()
      .type(60)
      .should('have.value', '59')
  })

  it('2秒経ったらタイマーが0になる', () => {
    cy.visit('/')
    cy.get('#input-time-sec')
      .clear()
      .type(2)
    cy.get('#start-button').click()
    cy.get('#timer').should('contain', '00:00:00')
  })
})