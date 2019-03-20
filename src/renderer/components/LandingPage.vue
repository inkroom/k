<template>
  <el-container style="height:100%">
    <el-aside width="200px" class="left">
      <tree @leaf-click="leafClick"></tree>
      <el-button size="small" style="position:absolute;bottom:5px;">添加</el-button>
    </el-aside>
    <el-main style="border:1px solid blue">
      <display :value="key" v-if="show"></display>
    </el-main>
  </el-container>
</template>

<script>


import Tree from "./redis/tree";
import Display from "./redis/display";

export default {
  name: "landing-page",
  data() {
    return {
      show: false,
      key: {}
    };
  },
  components: {  Tree, Display },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    leafClick(data) {

      this.key = data;
      let _this = this;
       _this.show = true;


    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

.left {
  border: 1px solid red;
}
</style>
