import { createLocalVue, shallowMount } from '@vue/test-utils'
import TimeDisplay from '@/components/TimeDisplay.vue'
import { expect, test } from '@jest/globals'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { state, mutations } from '@/store/index'

const localVue = createLocalVue()
localVue.use(Vuex)
describe('TimerDisplay#', () => {
  let wrapper;
  localVue.use(VueRouter)
  const router = new VueRouter()
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      mutations
    }),
      wrapper = shallowMount(TimeDisplay, {
        store,
        localVue,
        router,
        propsData: {
          timerFinished: false
        }
      })
  });
  test('1秒のタイマーが表示されていること', () => {
    const timer = wrapper.find('#timer')
    expect(timer.text()).toBe('00:00:01')
  })
});
