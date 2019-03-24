<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tabs__content:empty {
  border: none !important;
}
.el-main {
  padding: 0 !important;
  overflow: hidden !important;
  position: relative;
}
.el-tabs {
  height: 100%;
}

.el-tabs__header {
  position: absolute !important;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 120;
}
.el-tabs__content {
  margin-top: 38px;
}
.el-tab-pane {
  max-height: 80%;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
/* .el-scrollbar__thumb {
  background-color: black !important;
} */
</style>

<template>
  <el-container style="height:100%">
    <el-aside width="250px" class="left">
      <tree @leaf-click="leafClick" @key-remove="keyRemove"></tree>
      <div style="position:fixed;bottom:5px">
        <el-button
          size="small"
          style="bottom:5px;"
          type="primary"
          @click="dialog.add_host.visible = true"
        >添加连接</el-button>
        <el-button size="small" style="bottom:5px;" @click="dialog.subscribe.visible = true">订阅</el-button>
      </div>
    </el-aside>

    <el-main>
      <el-scrollbar style="height:100%;">
        <el-tabs
          v-model="tabs.now"
          type="border-card"
          closable
          @tab-remove="tabRemove"
          v-if="tabs.keys.length>0"
        >
          <el-tab-pane
            :label="getTabKey(item)"
            :name="getTabKey(item)"
            :key="getTabKey(item)"
            v-for="(item) in tabs.keys"
          >
            <subscribe v-if="item.channel" :client="item.client" :channel="item.channel"></subscribe>
            <display :redis="item.key" :client="item.client" v-else></display>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </el-main>

    <!-- 添加host弹出框 -->
    <el-dialog :visible.sync="dialog.add_host.visible" title="添加连接">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接名：" prop="name">
          <el-input placeholder="如：localhost" size="small" v-model="dialog.add_host.form.label"></el-input>
        </el-form-item>
        <el-form-item label="连接地址：" prop="host">
          <el-input placeholder="仅支持ipv4" size="small" v-model="dialog.add_host.form.host"></el-input>
        </el-form-item>
        <el-form-item label="连接端口：" prop="host">
          <el-input placeholder size="small" v-model="dialog.add_host.form.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库：" prop="host">
          <el-input placeholder="数据库序号" size="small" v-model="dialog.add_host.form.index"></el-input>
        </el-form-item>
        <el-form-item label="认证密码：">
          <el-input placeholder="可选" size="small" v-model="dialog.add_host.form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加连接</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加订阅发布框 -->
    <el-dialog :visible.sync="dialog.subscribe.visible" title="添加消息订阅">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接：" prop="name">
          <el-select
            v-model="dialog.subscribe.form.label"
            placeholder="请选择"
            size="small"
            style="width:100%"
          >
            <el-option
              v-for="( item,index ) in $store.state.hosts.hosts"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅频道：" prop="host">
          <el-input placeholder size="small" v-model="dialog.subscribe.form.channel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subscribe">订阅</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import Tree from "./tree";
import Display from "./display/display";
import Subscribe from "./display/subscribe";

import { isIPv4 } from "net";

export default {
  name: "landing-page",
  data() {
    return {
      tabs: {
        now: "",
        keys: [
          // { label: "", client: "", key: "" }
        ]
      },
      dialog: {
        add_host: {
          visible: false,
          form: {
            label: "",
            host: "",
            port: "",
            password: "",
            index: 0,
            leaf: false
          }
        },
        subscribe: {
          visible: false,
          form: {
            channel: "",
            label: ""
          }
        }
      }
    };
  },
  components: { Tree, Display, Subscribe },
  methods: {
    subscribe() {
      //订阅频道
      if (this.dialog.subscribe.form.label == "") {
        this.$message.error("请选择连接");
      } else if (this.dialog.subscribe.form.channel === "") {
        this.$message.error("请输入要订阅的频道");
      } else {
        console.log(`label=${this.dialog.subscribe.form.label}`);
        //拿到对应的client
        let index = this.$store.state.hosts.hosts.findIndex(
          d => d.label === this.dialog.subscribe.form.label
        );
        let client = this.$redis.redis.createClient(
          this.$store.state.hosts.hosts[index].port,
          this.$store.state.hosts.hosts[index].host
        );
        let item = {
          label: this.dialog.subscribe.form.label,
          channel: this.dialog.subscribe.form.channel,
          client: client
        };
        this.tabs.keys.push(item);

        // this.tabs.now = this.dialog.subscribe.form.label;
        this.setTab(item);
        this.dialog.subscribe.visible = false;
      }
    },
    keyRemove(parent, key) {
      //key被删除
      //查找对应的tab
      console.log("key");
      console.log(key);

      let tab = this.getTabKey(key);
      this.tabRemove(tab);
    },
    tabRemove(targetName) {
      let index = this.tabs.keys.findIndex(
        d => this.getTabKey(d) === targetName
      );
      //换另一个选中
      if (index !== this.tabs.keys.length - 1) {
        //选中下一个
        this.tabs.now = this.getTabKey(this.tabs.keys[index + 1]);
      } else if (index !== 0) {
        //不是下一个，选择上一个
        this.tabs.now = this.getTabKey(this.tabs.keys[index - 1]);
      }
      //移除当前
      this.tabs.keys.splice(index, 1);
    },
    getTabKey(item) {
      if (item.channel) return "订阅：" + item.label + "-" + item.channel;
      if (item.key) return item.label + "-" + item.key;
      return item.label;
    },
    setTab(item) {
      if (item.channel) {
        this.tabs.now = "订阅：" + item.label + "-" + item.channel;
      }
    },
    add() {
      console.log(this.dialog.add_host.form);
      console.log(this.dialog.add_host.form.name);
      console.log(this.dialog.add_host.form.name === "");
      if (this.dialog.add_host.form.label === "") {
        this.$message("连接名称不能为空");
      } else if (!isIPv4(this.dialog.add_host.form.host)) {
        this.$message("仅支持ipv4");
      } else if (isNaN(parseInt(this.dialog.add_host.form.port))) {
        this.$message("端口1-25535");
      } else if (
        parseInt(this.dialog.add_host.form.port) < 1 ||
        parseInt(this.dialog.add_host.form.port) > 65535
      ) {
        console.log(parseInt(this.dialog.add_host.form.port));
        this.$message("端口1-25535");
      } else {
        this.$store
          .dispatch(
            "addHost",
            JSON.parse(JSON.stringify(this.dialog.add_host.form))
          )
          .then(value => {
            this.dialog.add_host.visible = false;

            this.dialog.add_host.form.label = "";
            this.dialog.add_host.form.host = "";
            this.dialog.add_host.form.password = "";

            this.$message("添加成功");
          });
      }
    },
    leafClick(data, client) {
      // 判断当前是否有数据
      let index = this.tabs.keys.findIndex(d => {
        console.log(d);
        if (d.key) {
          return d.label === data.label && d.key === data.key;
        } else {
          return d.label === data.label;
        }
      });
      // let index = -1;
      console.log(data);
      console.log(`查找的index=${index}`);
      if (index === -1) {
        //新增
        data.client = client;
        this.tabs.keys.push(data);
      } else {
        // if(data.key)

        // this.$set(this.tabs.keys[index],'key',data.key);
        this.tabs.keys[index].key = data.key;
      }
      this.tabs.now = this.getTabKey(data);
    }
  },
  mounted() {}
};
</script>

<style>
.left {
  border-right: 1px solid rgb(170, 183, 197);
}
</style>
