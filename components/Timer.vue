<template>
  <div>
    <h1>Timeboxman</h1>
    <div id="timer" class="border rounded shadow-lg m-5 p-3 text-6xl">
      {{ getFormattedTime(timeeeee) }}
    </div>
    <input
      id="timeeeee"
      v-model="timeeeee"
      class="border rounded text-center"
    />
    sec
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      timeeeee: 1,
    };
  },
  methods: {
    setTimer: function (seconds) {
      this.timeeeee = seconds;
    },
    getFormattedTime: function (setSeconds) {
      const hours = Math.floor(setSeconds / (60 * 60));
      const hours_string = this.get0PadNumber(hours, 2);

      const minutes = Math.floor((setSeconds % (60 * 60)) / 60);
      const minutes_string = this.get0PadNumber(minutes, 2);

      const seconds = setSeconds - hours * (60 * 60) - minutes * 60;
      const seconds_string = this.get0PadNumber(seconds, 2);

      return hours_string + ":" + minutes_string + ":" + seconds_string;
    },
    get0PadNumber: function (number, length) {
      return number.toString().padStart(length, "0");
    },
  },
});
</script>