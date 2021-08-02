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
    <div class="m-2">
      <button
        id="set-5min-button"
        class="bg-white hover:bg-gray-100 border rounded p-1"
        @click="setTime(5)"
      >
        5 min
      </button>
      <button
        id="set-10min-button"
        class="bg-white hover:bg-gray-100 border rounded p-1"
        @click="setTime(10)"
      >
        10 min
      </button>
      <button
        id="set-30min-button"
        class="bg-white hover:bg-gray-100 border rounded p-1"
        @click="setTime(30)"
      >
        30 min
      </button>
    </div>
    <div class="m-2">
      <div class="inline-flex">
        <button
          id="minus-1min-button"
          class="
            bg-gray-300
            hover:bg-gray-400
            text-gray-800
            py-1
            px-2
            rounded-l
          "
          @click="minusMin(1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <span class="bg-gray-400 text-gray-800 py-1 px-2">1 min</span>
        <button
          id="plus-1min-button"
          class="
            bg-gray-300
            hover:bg-gray-400
            text-gray-800
            py-1
            px-2
            rounded-r
          "
          @click="plusMin(1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="m-2">
      <div class="inline-flex">
        <button
          id="minus-5min-button"
          class="
            bg-gray-300
            hover:bg-gray-400
            text-gray-800
            py-1
            px-2
            rounded-l
          "
          @click="minusMin(5)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <span class="bg-gray-400 text-gray-800 py-1 px-2">5 min</span>
        <button
          id="plus-5min-button"
          class="
            bg-gray-300
            hover:bg-gray-400
            text-gray-800
            py-1
            px-2
            rounded-r
          "
          @click="plusMin(5)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="m-10">
      <input
        id="room-id"
        v-model="roomId"
        class="border rounded text-center w-36 p-1"
        maxlength="10"
      />
      <button
        id="room-button"
        class="border rounded p-1"
        @click="sendGetRoomId"
      >
        Room
      </button>
      <button
        id="set-room-id-button"
        class="border rounded p-1"
        @click="manualSendSetRoomId"
      >
        Set Room
      </button>
      <div class="m-1">
        <input
          id="room-url"
          v-model="roomUrl"
          class="border rounded text-center w-max p-1"
        />
        <button id="copy-button" class="border rounded p-1" @click="doCopy">
          URLをコピーする
        </button>
      </div>
    </div>
    <div>
      <div
        id="message-box"
        v-if="timerFinished"
        class="
          bg-green-200
          absolute
          bottom-0
          p-4
          left-0
          right-0
          mx-auto
          max-w-md
          animate-bounce
        "
        @click="resetTimer"
      >
        {{ message }}
      </div>
      <div
        id="message-box2"
        v-if="message2"
        class="
          bg-blue-200
          absolute
          bottom-0
          p-4
          left-0
          right-0
          mx-auto
          max-w-md
        "
      >
        {{ message2 }}
      </div>
    </div>
  </div>
</template>

<script>
import finishedSound from "~/assets/sound/Warning-Siren01-3.mp3";
import io from "socket.io-client";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import { mapState, mapMutations } from "vuex";
Vue.use(VueClipboard);
export default Vue.extend({
  data() {
    return {
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
      message2: "",
      finishTime: "",
      roomUrl: "",
      isManualExecution: false,
    };
  },
  mounted: function () {
    this.socket = io(process.env.API_BASE_URL);
    this.socket.on("started", (data) => {
      console.log("received : started");
      if (data.started) {
        this.resetTimer();
        this.setHogeTime(data.hogeTime);
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
    this.socket.on("setRoomIdResult", (data) => {
      console.log("setRoomIdResult");
      if (data.result && this.isManualExecution) {
        this.setMessage(`Room[${data.roomId}]に入ったよ`);
      }
      this.isManualExecution = false;
    });

    this.roomUrl = location.href;
    this.joinRoom();
    this.setRoomUrl();
  },
  computed: {
    ...mapState(["hogeTime"]),
    getFormattedTime: function () {
      const hours = Math.floor(this.hogeTime / (60 * 60));
      const hoursString = this.get0PadNumber(hours, 2);

      const minutes = Math.floor((this.hogeTime % (60 * 60)) / 60);
      const minutesString = this.get0PadNumber(minutes, 2);

      const seconds = this.hogeTime - hours * (60 * 60) - minutes * 60;
      const secondsString = this.get0PadNumber(seconds, 2);

      return hoursString + ":" + minutesString + ":" + secondsString;
    },
    isFinished: function () {
      return this.hogeTime < 1 && this.started === true;
    },
  },
  methods: {
    ...mapMutations(["setHogeTime"]),
    doCopy: function () {
      const savedThis = this;
      this.$copyText(this.roomUrl).then(
        function (e) {
          savedThis.setMessage("コピーできました!!");
        },
        function (e) {
          savedThis.setMessage("コピーできませんでした😭");
        }
      );
    },
    joinRoom: function () {
      if (this.$route.query.roomId === undefined) {
        // console.log("query なしのときに呼ばれるところ");
        this.socket.emit("getRoomId");
      } else {
        // console.log(
        //   "query ありのときに呼ばれるところ: " + this.$route.query.roomId
        // );
        this.roomId = this.$route.query.roomId;
        this.sendSetRoomId();
        this.periodicalSetRoomId(60000);
      }
    },
    setMessage: async function (message, disappear = true) {
      this.message2 = message;
      if (disappear) {
        await this.sleep(2000);
        this.hideMessageBox2();
      }
    },
    hideMessageBox2: function () {
      this.message2 = "";
    },
    get0PadNumber: function (number, length) {
      return number.toString().padStart(length, "0");
    },
    sleep: function (msec) {
      return new Promise((resolve) => setTimeout(resolve, msec));
    },
    hogeTimer: function () {
      this.setHogeTime(30);
      console.log(">>>>" + this.hogeTime + "<<<<<");
    },
    startTimer: function () {
      if (this.hogeTime < 1) {
        return;
      }
      this.finishTime = this.getFinishTime(this.hogeTime);
      this.started = true;
      this.timerFinished = false;
    },
    getFinishTime(duration) {
      const currentDate = new Date();
      return currentDate.setSeconds(currentDate.getSeconds() + duration);
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
      let remainingTime = 0;
      while (this.hogeTime > 0 && this.started) {
        await this.sleep(1000);
        if (!this.started) {
          break;
        }
        remainingTime = this.finishTime - new Date().getTime();
        this.setHogeTime(
          remainingTime < 0 ? 0 : Math.floor(remainingTime / 1000)
        );
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
    sendSetRoomId: function () {
      console.log("send setRoomId");
      this.socket.emit("setRoomId", { roomId: this.roomId });
    },
    manualSendSetRoomId: function () {
      this.isManualExecution = true;
      this.sendSetRoomId();
    },
    periodicalSetRoomId: function (interval) {
      setInterval(this.sendSetRoomId, interval);
    },
    getTimerState: function () {
      return {
        started: this.started,
        hogeTime: this.hogeTime,
        roomId: this.roomId,
        finishTime: this.finishTime,
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
      this.setHogeTime(Number(this.inputSec) + Number(this.inputMin) * 60);
    },
    setRoomUrl: function () {
      // $router.push は await では処理が完了するまでの同期ができず、
      // 第2引数に完了時のコールバック関数を指定する必要がある
      this.$router.push({ query: { roomId: this.roomId } }, () => {
        this.roomUrl = location.href;
      });
    },
    setTime: function (minutes) {
      this.inputMin = minutes;
      this.inputSec = 0;
    },
    plusMin: function (minutes) {
      this.inputMin = Number(this.inputMin) + minutes;
    },
    minusMin: function (minutes) {
      this.inputMin = Number(this.inputMin) - minutes;
      if (this.inputMin < 0) {
        this.inputMin = 0;
      }
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
    hogeTime: function () {
      if (this.isFinished) {
        this.finishTimer();
      }
    },
    roomId: function () {
      this.setRoomUrl();
    },
  },
});
</script>