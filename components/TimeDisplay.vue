<template>
  <div>
    <div
      id="timer"
      class="
        border
        rounded
        shadow-lg
        m-5
        p-3
        text-6xl
        min-w-xs
        max-w-xs
        mx-auto
      "
      :class="{ 'bg-red-200': timerFinished }"
    >
      {{ getFormattedTime }}
    </div>
  </div>
</template>
    
<script>
import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
  props: ["timerFinished", "formattedTime"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["timerTime"]),
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
    get0PadNumber: function (number, length) {
      return number.toString().padStart(length, "0");
    },
  },
});
</script>