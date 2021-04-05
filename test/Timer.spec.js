import { mount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'
import { expect, test } from '@jest/globals'

describe('Timer', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(Timer)
  });

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('view title', () => {
    const div = wrapper.find('#title')
    expect(div.text()).toBe('Timeboxman')
  })

  test('1秒のタイマーが表示されていること', () => {
    const timer = wrapper.find('#timer')
    expect(timer.text()).toBe('00:00:01')
  })

  test('3を渡したら00:00:03 というフォーマットにして文字列を返す', () => {
    wrapper.vm.timerTime = 3
    expect(wrapper.vm.getFormattedTime).toBe('00:00:03')
  })

  test('タイマーを3秒にセットするとタイマーの表示が00:00:03になること', async () => {
    const timer = wrapper.find('#timer')
    wrapper.vm.inputSec = 3
    await wrapper.vm.updateTimerTime()
    expect(timer.text()).toBe('00:00:03')
  })

  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  test('2秒経ったらタイマーが0になること', async () => {
    const timer = wrapper.find('#timer')
    wrapper.vm.timerTime = 2
    wrapper.vm.startTimer()
    await sleep(3000)
    expect(timer.text()).toBe('00:00:00')
  })

  describe('スタートボタン', () => {
    test('スタートボタンが表示されていること', () => {
      const startButton = wrapper.find('#start-button')
      expect(startButton.exists()).toBe(true)
    })

    test('スタートボタンを押すとタイマーがスタートすること', () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.timerTime = 2
      expect(wrapper.vm.$data.started).toBe(false)
      startButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(true)
    })

    test('スタートボタンを押すとタイマー完了状態がリセットされること', () => {
      const startButton = wrapper.find('#start-button')
      wrapper.vm.$data.timerFinished = true

      startButton.trigger("click")

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
      wrapper.vm.timerTime = 10
      startButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(true)
      stopButton.trigger("click")
      expect(wrapper.vm.$data.started).toBe(false)
    })

    test('ストップボタンをクリック直後にスタートボタンが1秒間クリックできないようになっていること', async () => {
      const startButton = wrapper.find('#start-button')
      const stopButton = wrapper.find('#stop-button')
      wrapper.vm.timerTime = 10

      await startButton.trigger('click')
      await stopButton.trigger('click')

      expect(startButton.attributes().disabled).toBe('disabled')
    })
  });

  test('タイマーがカウントダウンしている間は時間入力のテキストボックスに入力できないようになること', async () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.timerTime = 10
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
    wrapper.vm.timerTime = 1
    await wrapper.vm.startTimer()
    await sleep(2000)

    expect(wrapper.vm.$data.timerFinished).toBe(true)
  })

  describe('タイマー完了状態', () => {
    test('タイマー完了状態は、メッセージボックスに完了メッセージが表示されていること', async () => {
      await wrapper.vm.finishTimer()

      const message = wrapper.find('#message-box')
      expect(message.text()).toBe('終わったよ！！')
    })

    test('タイマー完了状態は、タイマーの背景色が赤になること', async () => {
      await wrapper.vm.finishTimer()

      const timer = wrapper.find('#timer')
      expect(timer.attributes().class.split(' ').includes('bg-red-200')).toBe(true)
    })
  });

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

    wrapper.vm.timerTime = 1
    await startButton.trigger("click")
    await sleep(2000)
    const messageBox = wrapper.find('#message-box')
    await messageBox.trigger('click')

    expect(isReset(wrapper)).toBe(true)
  })

  test('タイマーが止まっているときにリセットボタンがクリックされたらタイマーがリセットされること', async () => {
    const startButton = wrapper.find('#start-button')
    const resetButton = wrapper.find('#reset-button')
    wrapper.vm.timerTime = 10
    await startButton.trigger('click')
    await resetButton.trigger('click')

    expect(isReset(wrapper)).toBe(true)
  })

  test('タイマーの時間（timerTime）が0のときにタイマーをスタートできないこと', async () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.timerTime = 0
    await startButton.trigger('click')

    expect(wrapper.vm.started).toBe(false)
  })

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

    test('秒のテキストボックスに入力した時間がタイマーに表示されていること', async () => {
      const textBox = wrapper.find('#input-time-sec')
      const timer = wrapper.find('#timer')
      await textBox.setValue(3)
      expect(timer.text()).toBe('00:00:03')
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

    // TODO spyが動かないけどそのうちテストしたい
    // test('秒のテキストボックスに入力するとvalidateメソッドが呼ばれる', async () => {
    //   const inputValidateSpy = jest.spyOn(wrapper.vm, 'validate')
    //   await wrapper.find('#input-time-sec').trigger('keypress', { key: 'a', keyCode: 64 })
    //   await sleep(3000)
    //   expect(inputValidateSpy).toHaveBeenCalled()
    //   inputValidateSpy.mockRestore()
    // });

    test('秒のテキストボックスに数字以外を入力したら空文字にする', async () => {
      const textBox = wrapper.find('#input-time-sec')
      await textBox.setValue('あ１')
      expect(textBox.element.value).toBe('')
    })

    test('秒のテキストボックスに60を入力したとき59秒へ自動的に変わること', async () => {
      const textBox = wrapper.find('#input-time-sec')
      const timer = wrapper.find('#timer')
      await textBox.setValue(60)
      expect(timer.text()).toBe('00:00:59')
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
      wrapper.vm.timerTime = 10
      await startButton.trigger("click")
      const inputMin = wrapper.find('#input-time-min')
      expect(inputMin.attributes().disabled).toBe("disabled")
    })
  });

  const isReset = (timer) => {
    const { timerTime, started, timerFinished, message } = timer.vm.$data
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
