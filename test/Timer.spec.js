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
    const div = wrapper.find('.title')
    expect(div.text()).toBe('TimerWorld')
  })

  test('1分のタイマーが表示されていること', () => {
    const wrapper = mount(Timer)
    const timer = wrapper.find('#timer')
    expect(timer.text()).toBe('00:01:00')
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
    expect(timer.text()).toBe('00:03:00')
  })

})
