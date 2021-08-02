import { createLocalVue, shallowMount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'
import { expect, test } from '@jest/globals'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { state, mutations } from '@/store/index.js'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Timer', () => {
  let wrapper;
  localVue.use(VueRouter)
  const router = new VueRouter()
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      mutations
    }),
      wrapper = shallowMount(Timer, {
        store,
        localVue,
        router,
        stubs: {
          TimeDisplay: true
        },
      })
  });

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('view title', () => {
    const div = wrapper.find('#title')
    expect(div.text()).toBe('Timeboxman')
  })

  test('3を渡したら00:00:03 というフォーマットにして文字列を返す', () => {
    wrapper.vm.setTimerTime(3)
    expect(wrapper.vm.getFormattedTime).toBe('00:00:03')
  })

  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  describe('スタートボタン', () => {
    test('スタートボタンが表示されていること', () => {
      const startButton = wrapper.find('#start-button')
      expect(startButton.exists()).toBe(true)
    })

    test('スタートボタンを押すとタイマーがスタートすること', () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.setTimerTime(2)
      expect(wrapper.vm.$data.started).toBe(false)
      startButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(true)
    })

    test('スタートボタンを押すとタイマー完了状態がリセットされること', async () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.setTimerTime(10)
      wrapper.vm.$data.timerFinished = true

      await startButton.trigger("click")

      expect(wrapper.vm.$data.timerFinished).toBe(false)
    })

  });

  describe('ストップボタン', () => {
    test('ストップボタンが表示されていること', () => {
      const stopButton = wrapper.find('#stop-button')
      expect(stopButton.exists()).toBe(true)
    })

    test('ストップボタンを押すとタイマーがストップすること', () => {
      const startButton = wrapper.find('#start-button')
      const stopButton = wrapper.find('#stop-button')
      wrapper.vm.setTimerTime(10)
      startButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(true)
      stopButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(false)
    })

    test('ストップボタンをクリック直後にスタートボタンが1秒間クリックできないようになっていること', async () => {
      const startButton = wrapper.find('#start-button')
      const stopButton = wrapper.find('#stop-button')
      wrapper.vm.setTimerTime(10)

      await startButton.trigger('click')
      await stopButton.trigger('click')

      expect(startButton.attributes().disabled).toBe('disabled')
    })
  });

  test('タイマーがカウントダウンしている間は時間入力のテキストボックスに入力できないようになること', async () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.setTimerTime(10)
    await startButton.trigger("click")
    const inputTime = wrapper.find('#input-time-sec')
    expect(inputTime.attributes().disabled).toBe("disabled")
  })

  test('タイマーが止まっているときはSTOPボタンが赤くなる', () => {
    const stopButton = wrapper.find('#stop-button')
    expect(stopButton.attributes().class.split(' ').includes('bg-red-200')).toBe(true)
  })

  test('タイマーがカウントダウンしているときはSTARTボタンが緑になる', async () => {
    const startButton = wrapper.find('#start-button')
    await startButton.trigger('click')
    expect(startButton.attributes().class.split(' ').includes('bg-green-200')).toBe(true)
  })

  test('画面ロード時はタイマー完了状態でないこと', () => {
    expect(wrapper.vm.$data.timerFinished).toBe(false)
  })

  test('カウントダウンがゼロになったらタイマー完了状態になること', async () => {
    wrapper.vm.setTimerTime(1)
    await wrapper.vm.startTimer()
    await sleep(1000)

    expect(wrapper.vm.$data.timerFinished).toBe(true)
  })

  describe('タイマー完了状態', () => {
    test('タイマー完了状態は、メッセージボックスに完了メッセージが表示されていること', async () => {
      await wrapper.vm.finishTimer()

      const message = wrapper.find('#message-box')
      expect(message.text()).toBe('終わったよ！！')
    })

    test('タイマーが完了状態でない場合は、メッセージボックスが存在しないこと', done => {
      wrapper.vm.$data.timerFinished = false

      wrapper.vm.$nextTick(() => {
        const message = wrapper.find('#message-box')
        expect(message.exists()).toBe(false)
        done()
      })
    })

    test('タイマー終了後、メッセージをクリックするとタイマーがリセットされること', async () => {
      const startButton = wrapper.find('#start-button')

      wrapper.vm.setTimerTime(1)
      await startButton.trigger("click")
      await sleep(2000)
      const messageBox = wrapper.find('#message-box')
      await messageBox.trigger('click')

      expect(isReset(wrapper)).toBe(true)
    })

    test('タイマーが止まっているときにリセットボタンがクリックされたらタイマーがリセットされること', async () => {
      const startButton = wrapper.find('#start-button')
      const resetButton = wrapper.find('#reset-button')
      wrapper.vm.setTimerTime(10)
      await startButton.trigger('click')
      await resetButton.trigger('click')

      expect(isReset(wrapper)).toBe(true)
    })

    test('タイマーの時間（timerTime）が0のときにタイマーをスタートできないこと', async () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.setTimerTime(0)
      await startButton.trigger('click')

      expect(wrapper.vm.started).toBe(false)
    })
  });


  describe('タイマーサウンド', () => {
    test('タイマー終了サウンドがTimerコンポーネントに存在している', () => {
      expect(wrapper.vm.audio).toBeTruthy()
    })

    test('タイマー終了時に終了サウンドが再生される', async () => {
      const finishSoundSpy = jest.spyOn(wrapper.vm.audio, 'play')
      wrapper.find('#start-button').trigger('click')
      await sleep(1100)
      expect(finishSoundSpy).toHaveBeenCalled()
      finishSoundSpy.mockRestore()
    })
  });

  describe('秒のテキストボックス', () => {
    test('秒を設定するテキストボックスが表示されていること', () => {
      const textBox = wrapper.find('#input-time-sec')
      expect(textBox.exists()).toBe(true)
    })

    test('時間のテキストボックスに数字を入力するとtrueが返ってくること', async () => {
      const e = { 'keyCode': 48 }
      const actual = await wrapper.vm.ignoreNonNumericInput(e)
      expect(actual).toBe(true)
    })

    test('時間のテキストボックスに数字以外を入力するとpreventDefaultが呼ばれていること', async () => {
      const keypressEvent = { keyCode: 100, preventDefault: function () { } }
      const spy = jest.spyOn(keypressEvent, 'preventDefault')
      await wrapper.vm.ignoreNonNumericInput(keypressEvent)
      expect(spy).toHaveBeenCalled()
    })

    test('秒のテキストボックスに数字以外を入力したら空文字にする', async () => {
      const textBox = wrapper.find('#input-time-sec')
      await textBox.setValue('あ１')
      expect(textBox.element.value).toBe('')
    })

  });

  describe('correctInputTime', () => {
    test('数字以外の文字列を渡すと空文字が返ってくる', () => {
      expect(wrapper.vm.correctInputTime('thisisstring')).toBe('')
    });
    test('分、秒は60以上表示させないため、60以上の数字を渡すと59が返ってくる', () => {
      expect(wrapper.vm.correctInputTime(60)).toBe(59)
      expect(wrapper.vm.correctInputTime(58)).toBe(58)
    });
    test('0以上59以下の数字はそのま表示する', () => {
      expect(wrapper.vm.correctInputTime(58)).toBe(58)
    });
    test('マイナスの場合は空文字を返す', () => {
      expect(wrapper.vm.correctInputTime(-1)).toBe('')
    });
  })

  describe('分のテキストボックス', () => {
    test('分を設定するテキストボックスが表示される', () => {
      const inputMin = wrapper.find('#input-time-min')
      expect(inputMin.exists()).toBe(true)
    })
    test('分のテキストボックスに3、秒に1を入力したらタイマーが181になる', async () => {
      const inputMin = wrapper.find('#input-time-min')
      const inputSec = wrapper.find('#input-time-sec')
      await inputMin.setValue(3)
      await inputSec.setValue(1)

      expect(wrapper.vm.timerTime).toBe(181)
    });
    test('分のテキストボックスに数字以外を入力したら空文字にする', async () => {
      const inputMin = wrapper.find('#input-time-min')
      await inputMin.setValue('あ１')
      expect(inputMin.element.value).toBe('')
    });
    test('タイマーがカウントダウンしている間は分のテキストボックスに入力できないようになる', async () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.setTimerTime(10)
      await startButton.trigger("click")
      const inputMin = wrapper.find('#input-time-min')
      expect(inputMin.attributes().disabled).toBe("disabled")
    })
  });

  describe('時間指定ボタン', () => {
    test('5分設定するボタンが表示されていること', () => {
      const set5minButton = wrapper.find('#set-5min-button')
      expect(set5minButton.exists()).toBe(true)
    })

    test('5分設定するボタンを押すとinputMinに5,inputSecに0が入っていること', () => {
      const set5minButton = wrapper.find('#set-5min-button')
      set5minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(5)
      expect(wrapper.vm.$data.inputSec).toBe(0)
    })

    test('10分設定するボタンが表示されていること', () => {
      const set10minButton = wrapper.find('#set-10min-button')
      expect(set10minButton.exists()).toBe(true)
    })

    test('10分設定するボタンを押すとinputMinに10,inputSecに0が入っていること', () => {
      const set10minButton = wrapper.find('#set-10min-button')
      set10minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(10)
      expect(wrapper.vm.$data.inputSec).toBe(0)
    })

    test('30分設定するボタンが表示されていること', () => {
      const set30minButton = wrapper.find('#set-30min-button')
      expect(set30minButton.exists()).toBe(true)
    })

    test('30分設定するボタンを押すとinputMinに30,inputSecに0が入っていること', () => {
      const set30minButton = wrapper.find('#set-30min-button')
      set30minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(30)
      expect(wrapper.vm.$data.inputSec).toBe(0)
    })
  });

  describe('時間増減ボタン', () => {
    test('1分増やすボタンが表示されていること', () => {
      const plus1minButton = wrapper.find('#plus-1min-button')
      expect(plus1minButton.exists()).toBe(true)
    })

    test('inputMinが1のとき1分増やすボタンを押すと2になること', () => {
      wrapper.vm.inputMin = 1
      const plus1minButton = wrapper.find('#plus-1min-button')
      plus1minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(2)
    })

    test('1分減らすボタンが表示されていること', () => {
      const minus1minButton = wrapper.find('#minus-1min-button')
      expect(minus1minButton.exists()).toBe(true)
    })

    test('inputMinが2のとき1分減らすボタンを押すと1になること', () => {
      wrapper.vm.inputMin = 2
      const minus1minButton = wrapper.find('#minus-1min-button')
      minus1minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(1)
    })

    test('inputMinが0のとき1分減らすボタンを押してもマイナスにならないこと', () => {
      wrapper.vm.inputMin = 0
      const minus1minButton = wrapper.find('#minus-1min-button')
      minus1minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(0)
    })

    test('5分増やすボタンが表示されていること', () => {
      const plus5minButton = wrapper.find('#plus-5min-button')
      expect(plus5minButton.exists()).toBe(true)
    })

    test('inputMinが1のとき5分増やすボタンを押すと6になること', () => {
      wrapper.vm.inputMin = 1
      const plus5minButton = wrapper.find('#plus-5min-button')
      plus5minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(6)
    })

    test('5分減らすボタンが表示されていること', () => {
      const minus5minButton = wrapper.find('#minus-5min-button')
      expect(minus5minButton.exists()).toBe(true)
    })

    test('inputMinが6のとき5分減らすボタンを押すと1になること', () => {
      wrapper.vm.inputMin = 6
      const minus5minButton = wrapper.find('#minus-5min-button')
      minus5minButton.trigger("click")
      expect(wrapper.vm.$data.inputMin).toBe(1)
    })

  });


  describe('ルームのテスト', () => {
    test('指定した時間おきにルームに入れること', () => {
      jest.useFakeTimers();

      const spy = jest.spyOn(wrapper.vm, 'sendSetRoomId');
      wrapper.vm.periodicalSetRoomId(1000);

      // 3000ms経過させる
      jest.advanceTimersByTime(3000);
      expect(spy).toHaveBeenCalledTimes(3)
    })
  });

  // describe('ルームのテスト', () => {
  //   test('ルームのURLをコピーできていること', async () => {
  //     this.sleep(3000)
  //     const roomUrl = wrapper.find('#room-url')
  //     const copyButton = wrapper.find('#copy-button')
  //     await copyButton.trigger("click")
  //     expect(roomUrl.element.value).toBe(window.getSelection().toString())
  //   })
  // });

  // test('default の roomId で接続する', () => {
  //   const socketEmitSpy = jest.spyOn(Timer.socket, 'emit')
  //   expect(socketEmitSpy).toHaveBeenCalled()
  //   socketEmitSpy.mockRestore()
  // });

  const isReset = (timer) => {
    const { started, timerFinished, message } = timer.vm.$data
    const timerTime = timer.vm.timerTime
    const motoTime = Number(timer.vm.inputSec) + Number(timer.vm.inputMin) * 60;
    if (
      timerTime === motoTime &&
      timerFinished === false &&
      message === '' &&
      started === false
    ) {
      return true
    }
    return false
  }
})
