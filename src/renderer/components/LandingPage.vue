<template>
  <el-container style="height:100%">
    <el-aside width="250px" class="left">
      <tree @leaf-click="leafClick"></tree>
      <el-button size="small" style="position:absolute;bottom:5px;">添加</el-button>
    </el-aside>
    <el-main style="border:1px solid blue">
      <display :value="key" v-if="show" :client="client"></display>
    </el-main>
  </el-container>
</template>

<script>
import Tree from "./tree";
import Display from "./display/display";

export default {
  name: "landing-page",
  data() {
    return {
      show: false,
      key: {}
    };
  },
  components: { Tree, Display },
  methods: {
    leafClick(data, client) {
      this.show = false;
      this.key = data;
      this.client = client;
      this.show = true;
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
