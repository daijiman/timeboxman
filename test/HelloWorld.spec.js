import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import { expect, test } from '@jest/globals'

describe('HelloWorld', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.vm).toBeTruthy()
  })

  test('view HelloWorld', () => {
    const wrapper = mount(HelloWorld)
    const div = wrapper.find('.title')
    expect(div.text()).toBe('HelloWorld')
  })
})





