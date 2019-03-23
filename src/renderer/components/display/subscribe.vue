<template>
  <div>
    <el-row>
      <span>{{ status?'正在':'取消' }}监听{{ channel }}-频道</span>
      <!-- <el-button>取消订阅</el-button> -->
    </el-row>
    <el-row>
      <el-input type="textarea" v-model="message" disabled rows="15" ref="content"></el-input>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    client: {
      type: Object,
      required: true
    },
    channel: {
      type: String
    }
  },
  data() {
    return {
      message: "",
      status: true
    };
  },
  mounted() {
    this.client.subscribe(this.channel);
    this.client.on("message", (channel, message) => {
      console.log("我接收到信息了" + message);

      this.message += message;
      this.message += "\n";
      //定位到最后一行
      this.$refs.content.$refs.textarea.scrollTop = this.$refs.content.$refs.textarea.scrollHeight;
      //   console.log(this.$refs.content.$refs.textarea)
    });
    this.client.on("error", () => {
      this.status = false;
      this.$message.error("订阅连接已中断");
    });
    this.client.on("unsubscribe", (channel, count) => {
      this.status = false;
      this.$message(`已取消${channel}订阅`);
      console.log(
        "client unsubscribed from" +
          channel +
          ", " +
          count +
          " total subscriptions"
      );
    });
  }
};
</script>


