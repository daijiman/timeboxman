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
    const div = wrapper.find('.timer')
    expect(div.text()).toBe('00:01:00')
  })
})
