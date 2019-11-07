<template>
  <div class="component-subscribe">
    <el-row>
      <span>{{ status?'正在':'取消' }}监听&nbsp;{{ channel }}&nbsp;频道</span>
      <!-- <el-button>取消订阅</el-button> -->
    </el-row>
    <el-row>
      <div ref="content" class="msg-content">
        <p v-for="(item,index) in messages" :key="index">{{item}}</p>
      </div>

      <!-- <el-input type="textarea" v-model="message" disabled rows="15" ref="content" style="color:white"></el-input> -->
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: String,
      required: true
    },
    channel: {
      type: String
    }
  },
  data() {
    return {
      messages: [],
      status: true
    };
  },
  mounted() {
    this.$redis.subscribe(this.index, this.channel).then(client => {
      client.subscribe(this.channel);
      client.on("message", (channel, message) => {
        console.log("我接收到信息了" + message);

        this.messages.push(message);
        //定位到最后一行
        this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
        //   console.log(this.$refs.content.$refs.textarea)
      });
      client.on("error", () => {
        this.status = false;
        this.$message.error("订阅连接已中断");
      });
      client.on("unsubscribe", (channel, count) => {
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
    });
  }
};
</script>


<style lang="scss">
.component-subscribe .msg-content {
  height: 300px;
  width: 100%;
  border: 1px solid rgb(24, 81, 112);
  margin: 5px;
  margin-top: 10px;
  padding: 5px;

  > p {
    margin-top: 4px;
  }
}
</style>