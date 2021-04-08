<template>
  <div>
    <p>Hello Hoge</p>
    <Fuga :baa="year" @gee="fromFoo" />
  </div>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      year: 1
    };
  },
  methods: {
    fromFoo: function(e) {
      console.log(e)
    }
  }
});
</script>