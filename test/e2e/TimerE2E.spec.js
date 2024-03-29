describe('Room関連', () => {
  it('Test', () => {
    cy.visit('/')
    cy.visit('/')
  });
  it('roomIdに11文字入力しても10文字になること', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('#room-id')
      .clear()
      .type('abcdefghijk')
    cy.get('#room-id').should('have.value', 'abcdefghij')
  });
  // it('RoomUrlのコピーボタンを押したら、room-urlのテキストがクリップボードにコピーされる', () => {
  //   cy.visit('/')
  //   cy.get('#copy-button').click();
  //   cy.get('#room-url').should(($roomUrlInput) => {
  //     const roomUrl = $roomUrlInput.val();
  //     console.log("+++++++++++++++++",roomUrl)
  //     console.log('copy======>', window.getSelection().toString())
  //     // console.log('roomUrl  ======>', roomUrl)
  //     // expect(roomUrl).to.be(window.getSelection().toString())
  //     cy.task('getClipboard').should('contain', roomUrl);
  //     console.log('>>>>>>>>' + roomUrl)
  //   })
  // });
  it('/?roomid=xxx-xxx にアクセスしたらRoomId xxx-xxx に入る', () => {
    cy.visit('/?roomId=xxx-xxx')
    cy.get('#room-id').should('have.value', 'xxx-xxx')
  });
  it('タイマーにアクセスしたらRoomIdを自動的に取得する', () => {
    cy.visit('/')
    cy.get('#room-id').should(($roomIdInput) => {
      const val = $roomIdInput.val()
      expect(val).to.have.lengthOf(10)
    })
  })
  it('Roomボタンをクリックしたら#room-id テキストボックスに10文字のRoomIdが入る', () => {
    cy.visit('/')
    cy.get('#room-button')
      .click()
    cy.get('#room-id').should(($roomIdInput) => {
      const val = $roomIdInput.val()
      expect(val).to.have.lengthOf(10)
    })
  })
  it('Set Roomボタンをクリックすると、指定したRoomIdの部屋に入る ', () => {
    cy.visit('/')
    cy.wait(1000)
    cy.get('#room-id')
      .clear()
      .type('abcdefghij')
    cy.get('#set-room-id-button').click()
    cy.wait(1000)
    cy.get('#room-id')
    cy.get('#message-box2').should('contain', 'Room[abcdefghij]に入ったよ')
  });
})
describe('タイマーの表示', () => {
  it('初期アクセス時にタイマーの表示が00:00:00になっている', () => {
    cy.visit('/')
    cy.get('#timer').should('contain', "00:00:00")
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