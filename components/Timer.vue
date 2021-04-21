<template>
  <div>
    <h1 id="title">Timeboxman</h1>
    <TimeDisplay
      :formattedTime="getFormattedTime"
      :timerFinished="timerFinished"
    />
    <input
      id="input-time-min"
      v-model="inputMin"
      class="border rounded text-center w-8"
      :disabled="started"
    />
    min
    <input
      id="input-time-sec"
      v-model="inputSec"
      class="border rounded text-center w-8"
      :disabled="started"
      @keypress="ignoreNonNumericInput"
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
    <input
      id="room-id"
      v-model="roomId"
      class="border rounded text-center w-16"
    />
    <div
      id="message-box"
      v-if="timerFinished"
      class="bg-green-200 absolute bottom-0 p-4 left-0 right-0 mx-auto max-w-md animate-bounce"
      @click="resetTimer"
    >
      {{ message }}
    </div>
    <button id="room-button" class="border rounded p-1" @click="sendGetRoomId">
      Room
    </button>
  </div>
</template>

<script>
import finishedSound from "~/assets/sound/Warning-Siren01-3.mp3";
import io from "socket.io-client";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      timerTime: 1,
      inputSec: 1,
      inputMin: 0,
      roomId: "default",
      started: false,
      timerFinished: false,
      message: "",
      startButtonDisabled: false,
      audio: new Audio(finishedSound),
      socket: "",
      socketId: "",
    };
  },
  mounted: function () {
    this.socket = io(process.env.API_BASE_URL);
    this.socket.on("started", (data) => {
      console.log("received : started");
      if (data.started) {
        this.resetTimer();
        this.timerTime = data.timerTime;
        this.startTimer();
      }
    });
    this.socket.on("stop", (data) => {
      console.log("received : stop");
      this.stopTimer();
    });
    this.socket.on("receiveRoomId", (data) => {
      console.log("received : roomId :" + data.roomId);
      this.roomId = data.roomId;
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
    stopTimer: async function (needEmit = false) {
      this.started = false;
      if (needEmit) {
        this.sendStop();
      }
      this.preventStartingTimer();
    },
    preventStartingTimer: async function () {
      this.startButtonDisabled = true;
      await this.sleep(500);
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
      this.updateTimerTime();
      this.timerFinished = false;
      this.message = "";
      this.audio.pause();
      this.preventStartingTimer();
    },
    sendStarted: function () {
      this.socket.emit("started", this.getTimerState());
    },
    sendStop: function () {
      console.log("send stop");
      this.socket.emit("stop", this.getTimerState());
    },
    sendGetRoomId: function () {
      console.log("send getRoomId");
      this.socket.emit("getRoomId");
    },
    getTimerState: function () {
      return {
        started: this.started,
        timerTime: this.timerTime,
        roomId: this.roomId,
      };
    },
    ignoreNonNumericInput: function (e) {
      const charCode = e.which ? e.which : e.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    correctInputTime: function (time) {
      if (isNaN(time) || time < 0) {
        return "";
      }

      if (60 <= time) {
        return 59;
      }
      return time;
    },
    updateTimerTime: function () {
      this.timerTime = Number(this.inputSec) + Number(this.inputMin) * 60;
    },
  },
  watch: {
    inputSec: function () {
      this.inputSec = this.correctInputTime(this.inputSec);
      this.updateTimerTime();
    },
    inputMin: function () {
      this.inputMin = this.correctInputTime(this.inputMin);
      this.updateTimerTime();
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