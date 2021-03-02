<template>
  <div>
    <div class="title">TimerWorld</div>
    <input id="timeeeee" v-model="timeeeee" class="border-gray-300">
    <div id="timer">00:0{{ timeeeee }}:00</div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      timeeeee: 1
    }
  }
})
</script>