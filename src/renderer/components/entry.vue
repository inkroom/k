<template>
  <div>
    <div class="header title two-col-container">
      <player></player>
    </div>
    <div class="main">
      <el-scrollbar style="height:100%">
        <list></list>
      </el-scrollbar>
    </div>
  </div>

  <!-- <el-container>
    <el-header class="title two-col-container">
      <player></player>
    </el-header>
    <el-main>
      <list></list>
    </el-main>
  </el-container>-->
</template>
<script>
import Player from "./player";
import List from "./list";
export default {
  components: { Player, List },
  data() {
    return {
      process: 39
    };
  },
  methods: {}
};
</script>


<style lang="scss" >
$title-height: 80px;

* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title{
   height: $title-height ;
}

.main {
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 0;
  overflow: hidden;
}
</style>
