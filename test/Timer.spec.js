import { mount } from '@vue/test-utils'
import Timer from '@/components/Timer.vue'
import { expect, test } from '@jest/globals'

describe('Timer', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Timer)
    expect(wrapper.vm).toBeTruthy()
  })

  test('view title', () => {
    const wrapper = mount(Timer)
    const div = wrapper.find('#title')
    expect(div.text()).toBe('Timeboxman')
  })

  test('1秒のタイマーが表示されていること', () => {
    const wrapper = mount(Timer)
    const timer = wrapper.find('#timer')
    expect(timer.text()).toBe('00:00:01')
  })

  test('時間を設定するテキストボックスが表示されていること', () => {
    const wrapper = mount(Timer)
    const textBox = wrapper.find('#input-time')
    expect(textBox.exists()).toBe(true)
  })

  test('テキストボックスに入力した時間がタイマーに表示されていること', async () => {
    const wrapper = mount(Timer)
    const textBox = wrapper.find('#input-time')
    const timer = wrapper.find('#timer')
    await textBox.setValue(3)
    expect(timer.text()).toBe('00:00:03')
  })

  test('3を渡したら00:00:03 というフォーマットにして文字列を返す', () => {
    const wrapper = mount(Timer)
    wrapper.vm.timerTime = 3
    expect(wrapper.vm.getFormattedTime).toBe('00:00:03')
  })

  test('タイマーを3秒にセットするとタイマーの表示が00:00:03になること', async () => {
    const wrapper = mount(Timer)
    const timer = wrapper.find('#timer')
    await wrapper.vm.setTimer(3)
    expect(timer.text()).toBe('00:00:03')
  })

  const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
  test('2秒経ったらタイマーが0になること', async () => {
    const wrapper = mount(Timer)
    const timer = wrapper.find('#timer')
    wrapper.vm.setTimer(2)
    wrapper.vm.startTimer()
    await sleep(3000)
    expect(timer.text()).toBe('00:00:00')
  })

  test('スタートボタンが表示されていること', () => {
    const wrapper = mount(Timer)
    const startButton = wrapper.find('#start-button')
    expect(startButton.exists()).toBe(true)
  })

  test('スタートボタンを押すとタイマーがスタートすること', () => {
    const wrapper = mount(Timer)
    const startButton = wrapper.find('#start-button')
    wrapper.vm.setTimer(2)
    expect(wrapper.vm.$data.started).toBe(false)
    startButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(true)
  })

  test('ストップボタンが表示されていること', () => {
    const wrapper = mount(Timer)
    const stopButton = wrapper.find('#stop-button')
    expect(stopButton.exists()).toBe(true)
  })

  test('ストップボタンが表示されていること', () => {
    const wrapper = mount(Timer)
    const startButton = wrapper.find('#start-button')
    const stopButton = wrapper.find('#stop-button')
    wrapper.vm.setTimer(10)
    startButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(true)
    stopButton.trigger("click")
    expect(wrapper.vm.$data.started).toBe(false)
  })

  test('タイマーがカウントダウンしている間は時間入力のテキストボックスに入力できないようになること', async () => {
    const wrapper = mount(Timer)
    const startButton = wrapper.find('#start-button')
    wrapper.vm.setTimer(10)
    await startButton.trigger("click")
    const inputTime = wrapper.find('#input-time')
    expect(inputTime.attributes().disabled).toBe("disabled")
  })

  test('タイマーが止まっているときはSTOPボタンが赤くなる', () => {
    const wrapper = mount(Timer)
    const stopButton = wrapper.find('#stop-button')
    expect(stopButton.attributes().class.split(' ').includes('bg-red-200')).toBe(true)
  })

  test('タイマーがカウントダウンしているときはSTARTボタンが緑になる', async () => {
    const wrapper = mount(Timer)
    const startButton = wrapper.find('#start-button')
    await startButton.trigger('click')
    expect(startButton.attributes().class.split(' ').includes('bg-green-200')).toBe(true)
  })
})
