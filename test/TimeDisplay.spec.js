import { mount } from '@vue/test-utils'
import TimeDisplay from '@/components/TimeDisplay.vue'
import { expect, test } from '@jest/globals'

describe('TimerDisplay#', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(TimeDisplay, {
      propsData: {
        formattedTime: '00:00:01',
        timerFinished: false
      }
    })
  });
  test('1秒のタイマーが表示されていること', () => {
    const timer = wrapper.find('#timer')
    expect(timer.text()).toBe('00:00:01')
  })
});
