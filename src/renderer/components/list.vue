<template>
  <div style="height:100%" id="k-music-list-container">
    <p style="padding:5px;">共 {{ musicsSize }} 首</p>
    <el-scrollbar style="height:100%;">
      <ul class="k-m-list" ref="list">
        <li v-for="(m,i) in musics" :key="i" class="text-ellipsis">
          {{ i+1 }} .
          <span
            v-if="!m.status"
            class="el-badge__content el-badge__content--undefined"
          >error</span>

          <span style="float:right">
            <span>{{ m.originName }}</span>
            <span>{{ m.time | humanTime}}</span>
            <span>
              <i class="el-icon-delete" @click="remove(m)"></i>
            </span>
          </span>
          <span v-if="index==i">
            <i class="iconfont icon-hand-pointing-right"></i>
          </span>
          <span
            class="name"
            @click="play(i)"
            :title="m.name +' - '+m.author"
          >{{ m.name }} - {{m.author}}</span>
        </li>
      </ul>
      <i class="iconfont icon-location-searching" @click="location"></i>
      <import :show.sync="dialog.import.visible"></import>
    </el-scrollbar>
  </div>
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
    console.log("data");
    console.log(this.$store.state);
    return {
      dialog: {
        import: { visible: false }
      },
      mode: {
        random: true
      },
      index: -1
    };
  },
  created() {
    this.$eventHub.$on("next", this.next);
    this.$eventHub.$on("prev", music => {});
    this.$eventHub.$on("playError", music => {
      //查找index
      let index = this.musics.findIndex(d => d.id === music.id);
      if (index != -1) {
        music.status = false;
        this.$store.dispatch("updateMusic", { index, music });
      }
    });

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
        this.index = index;
        this.$eventHub.$emit("musicChange", this.musics[index]);
      } else {
        console.log("获取播放url");
        this.$helper
          .getMusic(Object.assign({}, this.musics[index]))
          .then(music => {
            if (music.url && music.url !== "") {
              this.index = index;
              this.$store.dispatch("updateMusic", { index, music });
              this.$eventHub.$emit("musicChange", music);
            } else {
              let music = Object.assign({ status: false }, this.musics[index]);
              music.status = false;
              this.$store.dispatch("updateMusic", { index, music });
              this.$message(`${music.name} 不能播放`);
            }
          });
      }
    },
    location() {
      function getStyle(obj, attr) {
        if (obj.currentStyle) {
          return obj.currentStyle[attr];
        } else {
          return document.defaultView.getComputedStyle(obj, null)[attr];
        }
      }

      if (this.index !== -1) {
        let margin = getStyle(this.$refs.list.children[0], "marginTop");
        if (margin !== "" && margin.indexOf("px") != -1) {
          margin = /^([0-9])/.exec(margin)[1];
        } else {
          margin = 0;
        }

        this.$refs.list.parentNode.parentNode.scrollTop =
          this.$refs.list.children[this.index].offsetTop -
          margin * (this.index + 1);
      }
    }
  }
};
</script>
<style lang="scss">
$name-height: 24px;

#k-music-list-container {
  padding-bottom: 30px;
  box-sizing: border-box;
  .k-m-list {
    padding-right: 15px;
    padding-left: 15px;
    // padding-bottom: 30px;
    box-sizing: border-box;
    ul,
    li {
      list-style-type: none;
      margin: 10px 3px;
    }
    i {
      cursor: pointer;
    }
    .icon-hand-pointing-right {
      color: rgb(214, 203, 203);
      font-size: 20px;
    }
    .name {
      line-height: $name-height;
      height: $name-height;
    }
  }
  .icon-location-searching {
    cursor: pointer;

    font-size: 25px;
    position: fixed;
    bottom: 30px;
    right: 50px;
  }
}
</style>

<style lang="scss"  >
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
