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

  test('時間を設定するテキストボックスが表示されていること', () => {
    const textBox = wrapper.find('#input-time-sec')
    expect(textBox.exists()).toBe(true)
  })

  test('テキストボックスに入力した時間がタイマーに表示されていること', async () => {
    const textBox = wrapper.find('#input-time-sec')
    const timer = wrapper.find('#timer')
    await textBox.setValue(3)
    expect(timer.text()).toBe('00:00:03')
  })

  test('3を渡したら00:00:03 というフォーマットにして文字列を返す', () => {
    wrapper.vm.timerTime = 3
    expect(wrapper.vm.getFormattedTime).toBe('00:00:03')
  })

  test('タイマーを3秒にセットするとタイマーの表示が00:00:03になること', async () => {
    const timer = wrapper.find('#timer')
    await wrapper.vm.setTimer(3)
    expect(timer.text()).toBe('00:00:03')
  })

  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  test('2秒経ったらタイマーが0になること', async () => {
    const timer = wrapper.find('#timer')
    wrapper.vm.setTimer(2)
    wrapper.vm.startTimer()
    await sleep(3000)
    expect(timer.text()).toBe('00:00:00')
  })

  test('スタートボタンが表示されていること', () => {
    const startButton = wrapper.find('#start-button')
    expect(startButton.exists()).toBe(true)
  })

  test('スタートボタンを押すとタイマーがスタートすること', () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.setTimer(2)
    expect(wrapper.vm.$data.started).toBe(false)
    startButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(true)
  })

  test('ストップボタンが表示されていること', () => {
    const stopButton = wrapper.find('#stop-button')
    expect(stopButton.exists()).toBe(true)
  })

  test('ストップボタンを押すとタイマーがストップすること', () => {
    const startButton = wrapper.find('#start-button')
    const stopButton = wrapper.find('#stop-button')
    wrapper.vm.setTimer(10)
    startButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(true)
    stopButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(false)
  })

  test('タイマーがカウントダウンしている間は時間入力のテキストボックスに入力できないようになること', async () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.setTimer(10)
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
    await wrapper.vm.setTimer(1)
    await wrapper.vm.startTimer()
    await sleep(2000)

    expect(wrapper.vm.$data.timerFinished).toBe(true)
  })

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

  test('タイマーが完了状態でない場合は、メッセージボックスが存在しないこと', done => {
    wrapper.vm.$data.timerFinished = false

    wrapper.vm.$nextTick(() => {
      const message = wrapper.find('#message-box')
      expect(message.exists()).toBe(false)
      done()
    })
  })

  test('スタートボタンを押すとタイマー完了状態がリセットされること', () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.$data.timerFinished = true

    startButton.trigger("click")

    expect(wrapper.vm.$data.timerFinished).toBe(false)
  })

  test('タイマー終了後、メッセージをクリックするとタイマーがリセットされること', async () => {
    const startButton = wrapper.find('#start-button')

    await wrapper.vm.setTimer(1)
    await startButton.trigger("click")
    await sleep(2000)
    const messageBox = wrapper.find('#message-box')
    await messageBox.trigger('click')

    expect(isReset(wrapper)).toBe(true)
  })

  test('タイマーが止まっているときにリセットボタンがクリックされたらタイマーがリセットされること', async () => {
    const startButton = wrapper.find('#start-button')
    const resetButton = wrapper.find('#reset-button')
    wrapper.vm.setTimer(10)
    await startButton.trigger('click')
    await resetButton.trigger('click')

    expect(isReset(wrapper)).toBe(true)
  })

  test('ストップボタンをクリック直後にスタートボタンが1秒間クリックできないようになっていること', async () => {
    const startButton = wrapper.find('#start-button')
    const stopButton = wrapper.find('#stop-button')
    wrapper.vm.setTimer(10)

    await startButton.trigger('click')
    await stopButton.trigger('click')

    expect(startButton.attributes().disabled).toBe('disabled')
  })

  test('タイマーの時間（timerTime）が0のときにタイマーをスタートできないこと', async () => {
    const startButton = wrapper.find('#start-button')
    wrapper.vm.timerTime = 0
    await startButton.trigger('click')

    expect(wrapper.vm.started).toBe(false)
  })

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

  const isReset = (timer) => {
    const { inputTime, timerTime, started, timerFinished, message } = timer.vm.$data
    if (
      inputTime === timerTime &&
      timerFinished === false &&
      message === '' &&
      started === false
    ) {
      return true
    }
    return false
  }
})
