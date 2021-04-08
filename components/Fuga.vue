<template>
  <div>
    <button class="border" @click="buttonClickEventHandler">
      Fuga [{{ baa }}]
    </button>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  props: ["baa"],
  data() {
    return {};
  },
  methods: {
    buttonClickEventHandler: function (e) {
      this.$emit("gee", "AAAAAA");
    },
  },
});
</script>