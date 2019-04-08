<template>
  <el-dialog :visible.sync="visible">
    <el-input placeholder="分享的url" v-model="url"></el-input>
    <el-select v-model="origin" placeholder="来源">
      <el-option v-for="(item ,i) in originNames" :key="i" :label="item.name" :value="item.key"></el-option>
    </el-select>
    <el-button type="primary" @click="im">导入</el-button>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: Boolean
  },
  data() {
    return {
      visible: this.show,
      origin: "",
      url: ""
    };
  },
  computed: {
    originNames() {
      return this.$helper.getOriginNames();
    }
  },
  watch: {
    visible(nv, ov) {
      this.$emit("update:show", nv);
    }
  },
  methods: {
    im() {
      this.$helper
        .getMusics(this.origin, this.url)
        .then(musics => {
          console.log("import的音乐");
          console.log(musics);

          this.$store.dispatch("addMusics", musics).then(res => {});
        })
        .catch(err => {
          console.log(err);
          console.log("音乐导入失败");
        });
    }
  }
};
</script>
