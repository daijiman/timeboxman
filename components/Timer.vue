<template>
  <div>
    <h1 id="title">Timeboxman</h1>
    <div id="timer" class="border rounded shadow-lg m-5 p-3 text-6xl">
      {{ getFormattedTime }}
    </div>
    <input
      id="input-time"
      v-model="inputTime"
      class="border rounded text-center"
      v-bind:disabled="started"
    />
    sec
    <button
      id="start-button"
      class="border rounded p-1"
      v-on:click="startTimer"
      v-bind:class="{ 'bg-green-200': started }"
    >
      START
    </button>
    <button
      id="stop-button"
      class="border rounded p-1"
      v-bind:class="{ 'bg-red-200': !started }"
      v-on:click="stopTimer"
    >
      STOP
    </button>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      inputTime: 1,
      timerTime: 1,
      started: false,
    };
  },
  computed: {
    getFormattedTime: function () {
      const hours = Math.floor(this.timerTime / (60 * 60));
      const hoursString = this.get0PadNumber(hours, 2);

      const minutes = Math.floor((this.timerTime % (60 * 60)) / 60);
      const minutesString = this.get0PadNumber(minutes, 2);

      const seconds = this.timerTime - hours * (60 * 60) - minutes * 60;
      const secondsString = this.get0PadNumber(seconds, 2);

      return hoursString + ":" + minutesString + ":" + secondsString;
    },
  },
  methods: {
    setTimer: function (seconds) {
      this.inputTime = seconds;
    },
    get0PadNumber: function (number, length) {
      return number.toString().padStart(length, "0");
    },
    sleep: function (msec) {
      return new Promise((resolve) => setTimeout(resolve, msec));
    },
    startTimer: function () {
      this.started = true;
    },
    stopTimer: function () {
      this.started = false;
    },
    countDown: async function () {
      while (this.timerTime > 0 && this.started) {
        await this.sleep(1000);
        this.timerTime--;
      }
      this.started = false;
    },
  },
  watch: {
    inputTime: function () {
      this.timerTime = this.inputTime;
    },
    started: function () {
      if (this.started) {
        this.countDown();
      }
    },
  },
});
</script>