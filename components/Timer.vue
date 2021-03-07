<template>
  <div>
    <h1 id="title">Timeboxman</h1>
    <div
      id="timer"
      class="border rounded shadow-lg m-5 p-3 text-6xl min-w-xs max-w-xs mx-auto"
    >
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
    <button id="reset-button" class="border rounded p-1" @click="resetTimer">
      RESET
    </button>
    <div
      id="message-box"
      v-if="timerFinished"
      class="bg-green-200 absolute bottom-0 p-4 left-0 right-0 mx-auto max-w-md animate-bounce"
      @click="resetTimer"
    >
      {{ message }}
    </div>
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
      timerFinished: false,
      message: "",
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
      this.timerFinished = false;
    },
    stopTimer: function () {
      this.started = false;
    },
    finishTimer: function () {
      this.timerFinished = true;
    },
    countDown: async function () {
      while (this.timerTime > 0 && this.started) {
        await this.sleep(1000);
        if (!this.started) {
          break;
        }
        this.timerTime--;
      }
      if (this.timerTime == 0) {
        this.finishTimer();
      }
      this.started = false;
    },
    resetTimer: function () {
      this.started = false;
      this.timerTime = this.inputTime;
      this.timerFinished = false;
      this.message = "";
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
    timerFinished: function () {
      if (this.timerFinished) {
        this.message = "終わったよ！！";
      } else {
        this.message = "";
      }
    },
  },
});
</script>