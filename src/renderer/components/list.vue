<template>
  <el-scrollbar style="height:100%;" id="k-m-list-container">
    <p>当前共有 {{ musicsSize }} 首</p>
    <ul class="k-m-list">
      <li v-for="(m,i) in musics" :key="i">
        <span v-if="!m.status" class="el-badge__content el-badge__content--undefined">error</span>
        <span @click="play(i)" v-html="m.name +' - '+m.author"></span>
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
      },
      mode: {
        random: true
      }
    };
  },
  created() {
    this.$eventHub.$on("next", this.next);
    this.$eventHub.$on("prev", music => {});

    let v = { status: true, d: 3 };
    console.log("开始测试aa");
    console.log(v);
    console.log(Object.assign({ status: false, a: 3 }, v, false));
  },
  methods: {
    next(music) {
      if (this.mode.random) {
        if (this.musics.length == 0) {
          return;
        }
        if (this.musics.length === 1) {
          this.play(0);
          return;
        }
        let next = Math.floor(Math.random() * this.musics.length);
        if (music !== this.musics[next]) {
          this.play(next);
          // this.$eventHub.$emit('musicChange',next);
        } else {
          //重复则递归生成，歌曲数量够的话是不会递归过深的
          this.next(music);
        }
      }
    },
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
      if (this.musics[index].url && this.musics[index].url != "") {
        console.log(this.musics[index].url);
        console.log("有url，直接播放");
        this.$eventHub.$emit("musicChange", this.musics[index]);
      } else {
        console.log("获取播放url");
        this.$helper
          .getMusic(Object.assign({}, this.musics[index]))
          .then(music => {
            if (music.url && music.url !== "") {
              this.$store.dispatch("updateMusic", { index, music });

              this.$eventHub.$emit("musicChange", music);
            } else {
              let music = Object.assign({ status: false }, this.musics[index]);
              music.status = false;
              this.$store.dispatch("updateMusic", music);
              this.$message(`${music.name} 不能播放`);
            }
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
  padding-bottom: 15px;
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
