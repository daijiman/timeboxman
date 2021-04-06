<template>
  <div>
    <div
      id="timer"
      class="border rounded shadow-lg m-5 p-3 text-6xl min-w-xs max-w-xs mx-auto"
      :class="{ 'bg-red-200': timerFinished }"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>
    
<script>
import Vue from "vue";
export default Vue.extend({
  props: ["timerFinished", "formattedTime"],
  data() {
    return {};
  },
});
</script>