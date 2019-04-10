<template>
  <el-scrollbar style="height:100%;" id="k-m-list-container">
    <p>当前共有 {{ musicsSize }} 首</p>
    <ul class="k-m-list">
      <li v-for="(m,i) in musics" :key="i">
        <span v-if="!m.status" class="el-badge__content el-badge__content--undefined">error</span>
        <span @click="play(i)">{{ m.name }}</span>
        <span style="float:right">
          <span>{{ m.originName }}</span>
          <span>{{ m.time | humanTime}}</span>
          <span>
            <i class="el-icon-delete" @click="remove(m)"></i>
          </span>
        </span>
      </li>
    </ul>
    <import :show.sync="dialog.import.visible"></import>
  </el-scrollbar>
</template>
<script>
// import {Music } from ''

import origin from "../mixins/origin";
import Import from "./import";

export default {
  //   mixins: { origin },
  components: { Import },
  computed: {
    musics() {
      return this.$store.state.List.list;
    },
    musicsSize() {
      return this.$store.state.List.list.length;
    },
    originNames() {
      return this.$helper.getOriginNames();
    }
  },
  data() {
    return {
      dialog: {
        import: { visible: false }
      }
    };
  },
  filters: {
    humanTime(value) {
      let res = "";
      value = parseInt(value);
      res +=
        parseInt(value / 60) < 10
          ? "0" + parseInt(value / 60)
          : parseInt(value / 60);
      res += ":";
      res +=
        parseInt(value % 60) < 10
          ? "0" + parseInt(value % 60)
          : parseInt(value % 60);

      return res;
    }
  },
  methods: {
    remove(value) {
      console.log(value);
      this.$store
        .dispatch("removeMusic", Object.assign({}, value))
        .then(res => {})
        .catch(err => {
          console.log("删除失败");
        });
    },
    play(index) {
      if (this.musics[index].url && this.musics[index].url != '') {
        console.log(this.musics[index].url)
        console.log("有url，直接播放");
        this.$eventHub.$emit("musicChange", this.musics[index]);
      } else {
        console.log("获取播放url");
        this.$helper.getMusic(this.musics[index]).then(music => {
          this.$eventHub.$emit("musicChange", music);
        });
      }
    }
  }
};
</script>
<style lang="scss">
.k-m-list {
  padding-right: 15px;
  padding-left: 15px;
  ul,
  li {
    list-style-type: none;
    margin: 10px 3px;
  }
  i {
    cursor: pointer;
  }
}
</style>

<style lang="scss"  >
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
