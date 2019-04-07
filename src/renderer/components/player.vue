<template >
  <div class="title">
    <div class="cover left">
      <img :src="cover" alt>
    </div>
    <div class="right">
      <div>
        <span>{{title}}</span>
      </div>
      <div class="controller">
        <span>
          <i class="el-icon-d-arrow-left" @click="prev"></i>
        </span>
        <span>
          <i class="el-icon-caret-right" @click="playOrPause"></i>
        </span>
        <span>
          <i class="el-icon-d-arrow-right" @click="next"></i>
        </span>
        <span>
          <i class="el-icon-sort"></i>
        </span>
      </div>
      <div class="process-bar">
        <div class="bar">
          <el-slider v-model="process" :show-tooltip="false"></el-slider>
        </div>
        <span class="time">{{ converTime(now) }}/{{converTime(total)}}</span>
      </div>
    </div>
    <audio :src="url" @error="playerError" style="display:none;"></audio>
  </div>
</template>
<script >
export default {
  data() {
    return {
      title: "歌曲名",
      cover:
        "https://image-1252774288.cos.ap-chengdu.myqcloud.com/album/%E4%BA%8C%E6%AC%A1%E5%85%83/c391e135-d833-47d6-9992-e55c49694d94.jpg",
      url: "",
      process: 0,
      total: 3333,
      now: 123,
      playing: false
    };
  },
  methods: {
    prev() {},
    next() {},
    playOrPause() {},
    playerError() {},
    converTime(time) {
      let value = "";
      value +=
        parseInt(time / 60) > 9
          ? parseInt(time / 60)
          : "0" + parseInt(time / 60);
      value += ":";
      value += time % 60 > 9 ? time % 60 : "0" + (time % 60);
      return value;
    }
  }
}
</script>

<style lang="scss">
$title-height: 80px;
$cover-max-width: 60px;

$time-width: 100px;

.two-col-container {
  .left {
    float: left;
    width: $cover-max-width;
  }
  .right {
    padding-left: $cover-max-width + 15px;
  }
}

.title {
  height: $title-height !important;

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
      width: 25%;
      box-sizing: border-box;
      > i {
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
</style>

