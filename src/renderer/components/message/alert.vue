<template>
  <ul>
    <li v-for="(m,index) in msg" :key="index">{{ m }}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      msg: ['新的shuj'],
      show: true
    };
  },
  methods: {
    preappendShow(value) {
      this.msg.unshift(value);
      this.show = true;
    }
  }
};
</script>

<style lang="scss">
.k-alert-container {
  position: fixed;
  right: 0;
  bottom: 0;
  max-height: 200px;
  width: 200px;

  .el-header {
    text-align: right;
    // height: 30px;
    > i {
      cursor: pointer;
    }
  }
}
</style>
