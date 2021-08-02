export const state = () => ({
  timerTime: 1
})

export const getters = {
  timerTime: state => state.timerTime
}

export const mutations = {
  setTimerTime(state, time) {
    state.timerTime = time
  }
}

export const actions = {
  setTimerTime(context, payload) {
    context.commit('setTimerTime', payload.time)
  },
  timerTime(context, payload) {
    context.commit('setTimerTime', payload.time)
  }
}
