const state = () => ({
  timerTime: 0
})

const getters = {
  timerTime: state => state.timerTime
}

const mutations = {
  setTimerTime(state, time) {
    state.timerTime = time
  }
}

const actions = {
  // setTimerTime({ commit }) {
  setTimerTime(context, payload) {
    context.commit('setTimerTime', payload.time)
  }
}

export default {
  state,
  getters,
  mutaions,
  actions
}