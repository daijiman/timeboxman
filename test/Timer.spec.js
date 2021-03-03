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
    const textBox = wrapper.find('#timeeeee')
    expect(textBox.exists()).toBe(true)
  })

  test('テキストボックスに入力した時間がタイマーに表示されていること', async () => {
    const wrapper = mount(Timer)
    const textBox = wrapper.find('#timeeeee')
    const timer = wrapper.find('#timer')
    await textBox.setValue(3)
    expect(timer.text()).toBe('00:00:03')
  })

  test('3を渡したら00:00:03 というフォーマットにして文字列を返す', () => {
    const wrapper = mount(Timer)
    expect(wrapper.vm.getFormattedTime(3)).toBe('00:00:03')
  })

  test('タイマーを3秒にセットするとタイマーの表示が00:00:03になること', async () => {
    const wrapper = mount(Timer)
    const timer = wrapper.find('#timer')
    await wrapper.vm.setTimer(3)
    expect(timer.text()).toBe('00:00:03')
  })

  // test('3秒経ったらタイマーが0になること', () => {
  //   const wrapper = mount(Timer)
  //   const timer = wrapper.find('#timer')
  //   wrapper.setTimer(3)
  //   wrapper.startTimer()
  //   // 3秒待つ
  //   expect(timer.text()).toBe('00:00:00')
  // })

})
