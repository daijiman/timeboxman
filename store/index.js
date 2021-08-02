export const state = () => ({
  hogeTime: 1
})

export const getters = {
  hogeTime: state => state.hogeTime
}

export const mutations = {
  setHogeTime(state, time) {
    state.hogeTime = time
  }
}

export const actions = {
  // setHogeTime({ commit }) {
  setHogeTime(context, payload) {
    context.commit('setHogeTime', payload.time)
  },
  hogeTime(context, payload) {
    context.commit('setHogeTime', payload.time)
  }
}
