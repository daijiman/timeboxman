<template>
  <div>
    <h1 id="title">Timeboxman</h1>
    <div
      id="timer"
      class="border rounded shadow-lg m-5 p-3 text-6xl min-w-xs max-w-xs mx-auto"
      :class="{ 'bg-red-200': timerFinished }"
    >
      {{ getFormattedTime }}
    </div>
    <input
      id="input-time-sec"
      v-model="inputTime"
      class="border rounded text-center"
      :disabled="started"
    />
    sec
    <button
      id="start-button"
      class="border rounded p-1 disabled:opacity-50"
      :class="{ 'bg-green-200': started }"
      @click="startTimer"
      :disabled="startButtonDisabled"
    >
      START
    </button>
    <button
      id="stop-button"
      class="border rounded p-1"
      :class="{ 'bg-red-200': !started }"
      @click="stopTimer(true)"
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
import finishedSound from "~/assets/sound/Warning-Siren01-3.mp3";
import io from "socket.io-client";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      inputTime: 1,
      timerTime: 1,
      started: false,
      timerFinished: false,
      message: "",
      startButtonDisabled: false,
      audio: new Audio(finishedSound),
      socket: "",
    };
  },
  mounted: function () {
    this.socket = io("ws://localhost:3001");
    this.socket.on("started", (data) => {
      console.log("recieved : started");
      if (data.started) {
        this.resetTimer();
        this.timerTime = data.timerTime;
        this.startTimer();
      }
    });
    this.socket.on("stop", (data) => {
      console.log("recieved : stop");
      this.stopTimer();
    });
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
    isFinished: function () {
      return this.timerTime === 0 && this.started === true;
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
      if (this.timerTime < 1) {
        return;
      }
      this.started = true;
      this.timerFinished = false;
    },
    stopTimer: async function (needEmit=false) {
      this.started = false;
      if(needEmit){
        this.sendStop();
      }
      this.preventStartingTimer();
    },
    preventStartingTimer: async function () {
      this.startButtonDisabled = true;
      await this.sleep(1000);
      this.startButtonDisabled = false;
    },
    finishTimer: function () {
      this.timerFinished = true;
      this.message = "終わったよ！！";
      this.started = false;
      this.audio.play();
    },
    countDown: async function () {
      while (this.timerTime > 0 && this.started) {
        await this.sleep(1000);
        if (!this.started) {
          break;
        }
        this.timerTime--;
      }
    },
    resetTimer: function () {
      this.started = false;
      this.timerTime = this.inputTime;
      this.timerFinished = false;
      this.message = "";
      this.audio.pause();
      this.preventStartingTimer();
    },
    sendStarted: function () {
      const data = { started: this.started, timerTime: this.timerTime };
      this.socket.emit("started", data);
    },
    sendStop: function () {
      console.log("send stop");
      const data = { started: false };
      this.socket.emit("stop", data);
    },
  },
  watch: {
    inputTime: function () {
      this.timerTime = this.inputTime;
    },
    started: function () {
      if (this.started) {
        this.countDown();
        this.sendStarted();
      }
    },
    timerTime: function () {
      if (this.isFinished) {
        this.finishTimer();
      }
    },
  },
});
</script>