<template >
  <div id="player">
    <div class="cover left">
      <img :src="music.cover" alt>
    </div>
    <div class="right">
      <div>
        <span>{{music.name}}</span>
      </div>
      <div class="controller">
        <span>
          <i class="iconfont icon-prev" @click="prev"></i>
          <!-- <i class="el-icon-d-arrow-left" @click="prev"></i> -->
        </span>
        <span v-if="playing">
          <i class="iconfont icon-play" @click="playOrPause"></i>
          <!-- <path t="1555081285936" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1164" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M514 114.4c-220 0-398.8 178.9-398.8 398.8S294 912 514 912s398.8-178.9 398.8-398.8S733.4 114.4 514 114.4z m0 754.9c-196.5 0-356.1-159.6-356.1-356.1-0.6-196.5 159.6-356.1 356.1-356.1s356.1 159.6 356.1 356.1S710.5 869.3 514 869.3z" p-id="1165" fill="#1296db"></path><path d="M698.2 472.3L448.3 328.1c-14.9-8.6-32.7-8.6-47.6 0-15 8.7-23.9 24.1-23.9 41.4v288.3c0 17.3 8.9 32.8 23.9 41.4 7.5 4.3 15.7 6.5 23.8 6.5 8.2 0 16.3-2.1 23.8-6.4l249.9-144.2c15-8.6 23.9-24.1 23.9-41.5 0-17.2-8.9-32.7-23.9-41.3z m-21.3 45.9L427 662.3c-2 1.2-3.8 0.6-4.9 0-1.2-0.7-2.6-2-2.6-4.5V369.6c0-2.5 1.4-3.8 2.6-4.4 0.6-0.4 1.5-0.7 2.5-0.7 0.7 0 1.6 0.2 2.4 0.7l249.9 144.2c2.1 1.2 2.5 3.1 2.5 4.5 0 1.2-0.5 3.1-2.5 4.3z" p-id="1166" fill="#1296db"></path></path> -->
          <!-- <i class="el-icon-caret-right" @click="playOrPause" :title="playing?'播放中':'已暂停'"></i> -->
        </span>
        <span v-else>
          <i class="iconfont icon-pause"  @click="playOrPause"></i>
          <!-- <icon icon-class="play" /> -->
        </span>
        <span>
          <i class="iconfont icon-next" @click="next"></i>
          <!-- <i class="el-icon-d-arrow-right" @click="next"></i> -->
        </span>
        <span><i class="iconfont icon-random"></i>
          <!-- <i class="el-icon-sort"></i> -->
        </span>
        <span style="position:relative">
          <!-- <el-slider
            v-model="volume"
            vertical
            height="100px"
            :show-tooltip="false"
          ></el-slider>-->
          <i class="iconfont icon-volume"></i>
          <!-- <i class="el-icon-bell"></i> -->
        </span>
      </div>
      <div class="process-bar">
        <div class="bar">
          <el-slider v-model="process" :show-tooltip="false" ref="slider" @change="seek"></el-slider>
        </div>
        <span class="time">{{ music.current | humanTime }}/{{ music.time | humanTime }}</span>
      </div>
    </div>
    <audio
      :src="music.url"
      @error="playerError"
      style="display:none;"
      ref="audio"
      autoplay
      @playing="playingEvent"
      @pause="playing = false"
      @timeupdate="timeupdate"
      @ended="playing = false"
    ></audio>
  </div>
</template>
<script >
export default {
  data() {
    return {
      process: 0,
      now: 0,
      volume: 50, //音量
      playing: false,
      drag: false,
      music: {
        name: "歌曲名",
        cover:
          "https://image-1252774288.cos.ap-chengdu.myqcloud.com/album/%E4%BA%8C%E6%AC%A1%E5%85%83/c391e135-d833-47d6-9992-e55c49694d94.jpg",
        url: "",
        time: 0,
        currentTime: 0
      }
    };
  },
  filters: {
    // timeFormat(value){
    // }
  },
  created() {
    //注册播放音乐改变事件，该事件可能来自于列表项点击，自动切换，搜索列表
    this.$eventHub.$on("musicChange", music => {
      this.music = Object.assign({ currentTime: 0 }, music);
      console.log("接收到播放请求");
    });
  },
  mounted() {
    //注册拖拽
    // this.$refs.slider.$refs.button1.$refs.button.addEventListener(
    //   "mousedown",
    //   () => {
    //     this.drag = true;
    //   }
    // );
    // this.$refs.slider.$refs.button1.$refs.button.addEventListener(
    //   "mouseup",
    //   () => {
    //     this.drag = false;
    //   }
    // );
    // document.addEventListener("mouseup", this.clearDrag);
  },
  destroyed() {
    // document.addEventListener("mouseup", this.clearDrag());
  },
  computed: {
    audio() {
      return this.$refs.audio;
    }
  },
  watch: {
    volume(nv) {
      this.audio.volume = nv / 100;
    }
  },
  methods: {
    prev() {},
    next() {
      //下一曲，传递当前音乐，避免重复播放
      this.$eventHub.$emit("next", this.music);
    },
    playingEvent() {
      this.music.time = this.audio.duration;
      this.music.current = this.audio.currentTime;
      this.audio.during;
      this.playing = true;
      this.audio.volume = this.volume / 100;
    },
    clearDrag() {
      this.drag = false;
      // document.removeEventListener("mouseup", this.clearDrag);
    },
    timeupdate() {
      var currentTime = this.audio.currentTime;
      var duration = this.audio.duration;

      this.process = (currentTime / duration) * 100;

      this.music.current = currentTime;

      // player.music.now = transTime(currentTime);
      // player.music.total = transTime(duration);
      // player.music.rate = 50;
      // player.music.rate = (currentTime / duration) * 100;
    },
    playOrPause() {
      if (this.music.url)
        if (this.playing) {
          this.audio.pause();
        } else {
          this.audio.play();
        }
    },
    playerError() {
      if (this.music.url !== "") {
        this.$message.error(`${this.music.name}无法播放，可能是版权受限`);
        //广播无法播放事件
        this.$eventHub.$emit("playerError", this.music);
      }
    },
    seek(process) {
      if (this.audio.fastSeek)
        this.audio.fastSeek((this.audio.duration * process) / 100);
      else {
        console.log(this.audio.duration);
        this.audio.currentTime = this.audio.duration * (process / 100);
        console.log(this.audio.currentTime);
        this.audio.play(); //暂停的情况下必须调用才能继续播放，播放中调用该方法无影响
      }
    }
  }
};
</script>

<style lang="scss">
$cover-max-width: 60px;

$time-width: 100px;

$name-height:24px;

.two-col-container {
  .left {
    float: left;
    width: $cover-max-width;
  }
  .right {
    padding-left: $cover-max-width + 15px;
  }
}

#player {
  .right > div:first-child {
    height: $name-height;
    line-height: $name-height;
    visibility: middle;
  }
  .cover {
    vertical-align: top;
    height: inherit;
    overflow: hidden;
    max-width: $cover-max-width;
    vertical-align: middle;
    > img {
      width: $cover-max-width;
    }
  }
  .controller {
    word-spacing: -6px; /*解决空白导致的占宽*/
    > span {
      text-align: center;
      word-spacing: 0;
      display: inline-block;
      width: 20%;
      box-sizing: border-box;
      > i {
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
  .process-bar {
    .bar {
      margin-right: -$time-width + 5px;
      float: left;
      width: 100%;
      vertical-align: bottom;
      > .el-slider {
        vertical-align: bottom;
        margin-right: $time-width + 5px;
      }
    }
    .time {
      width: $time-width;
      // margin-left: 5px;
      // display: block;
      // float: right;
      height: 38px;
      line-height: 38px;
    }
  }
}

// .el-header {
//   width: 100%;
//   height: $title-height;
//   position: fixed;
//   opacity: 1;
// }
.el-main {
  // margin-top: $title-height !important;
  // padding-top:0 !important;
}
</style>

