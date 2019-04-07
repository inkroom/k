<template>
  <el-container>
    <el-header class="title two-col-container">
      <player></player>
    </el-header>
    <el-main>
      <list></list>
    </el-main>
  </el-container>
</template>
<script>
import Player from './player';
import List from './list';
export default {
    components:{Player,List},
  data() {
    return {
      process: 39
    };
  },
  methods: {}
}
</script>


<style lang="scss" >
.el-main{
padding:0;
margin:0;
}
</style>
