export const state = () => ({
  hogeTime: 1
})

export const getters = {
  hogeTime: state => state.hogeTime
}

export const mutations = {
  setTimerTime(state, time) {
    state.hogeTime = time
  }
}

export const actions = {
  // setTimerTime({ commit }) {
  setTimerTime(context, payload) {
    context.commit('setTimerTime', payload.time)
  },
  hogeTime(context, payload) {
    context.commit('setTimerTime', payload.time)
  }
}
