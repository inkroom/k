<template>
  <el-container>
    <el-header class="title two-col-container">
      <player></player>
    </el-header>
    <el-main>Main</el-main>
  </el-container>
</template>
<script>
import Player from './player';
export default {
    components:{Player},
  data() {
    return {
      process: 39
    };
  },
  methods: {}
}
</script>


<style lang="scss">
</style>
