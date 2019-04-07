<template>
  <div>
    <p>当前共有 {{ musicsSize }} 首</p>
    <ul class="k-m-list">
      <li v-for="(m,i) in musics" :key="i">
        <span v-if="!m.status" class="el-badge__content el-badge__content--undefined">error</span>
        <span>{{ m.name }}</span>
        <span style="float:right">
          <span>{{ m.originName }}</span>
          <span>{{ m.time }}</span>
          <span>
            <i class="el-icon-delete" @click="remove(m)"></i>
          </span>
        </span>
      </li>
    </ul>
    <import :show.sync="dialog.import.visible"></import>
  </div>
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
        import: { visible: true }
      }
    };
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
    }
  }
};
</script>
<style lang="scss">
.k-m-list {
  ul,
  li {
    list-style-type: none;
  }
  i {
    cursor: pointer;
  }
}
</style>
