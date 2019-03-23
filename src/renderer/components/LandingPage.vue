<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tabs__content:empty{
  border: none !important;
}
</style>

<template>
  <el-container style="height:100%">
    <el-aside width="250px" class="left">
      <tree @leaf-click="leafClick"></tree>
      <div style="position:fixed;bottom:5px">
        <el-button size="small" style="bottom:5px;" @click="dialog.add_host.visible = true">添加连接</el-button>
        <el-button size="small" style="bottom:5px;" @click="dialog.subscribe.visible = true">订阅</el-button>
      </div>
    </el-aside>

    <el-main style="border:1px solid blue">
      <el-tabs v-model="tabs.now" type="border-card" closable @tab-remove="tabRemove" v-if="tabs.keys.length>0">
        <el-tab-pane
          :label="getTabKey(item)"
          :name="getTabKey(item)"
          :key="getTabKey(item)"
          v-for="(item) in tabs.keys"
        >
          <!-- <el-scrollbar style="height:80%;"> -->
            <subscribe v-if="item.channel" :client="item.client" :channel="item.channel"></subscribe>
            <display :redis="item.key" :client="item.client" v-else></display>
          <!-- </el-scrollbar> -->
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <!-- 添加host弹出框 -->
    <el-dialog :visible.sync="dialog.add_host.visible">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接名：" prop="name">
          <el-input placeholder="如：localhost" size="small" v-model="dialog.add_host.form.label"></el-input>
        </el-form-item>
        <el-form-item label="连接地址：" prop="host">
          <el-input placeholder="仅支持ipv4" size="small" v-model="dialog.add_host.form.host"></el-input>
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
    <el-dialog :visible="dialog.subscribe.visible" title="添加消息订阅">
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

import { setTimeout } from "timers";

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
            password: "",
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
      },
      rule: {
        name: [{ required: true, message: "请输入连接名称", trigger: "blur" }],
        host: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("连接地址不能为空"));
                return;
              }
              let preg = new RegExp(
                "([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"
              );
              let res = preg.exec(value);
              if (!res || res.length != 5) {
                callback(new Error("只支持ipv4"));
                return;
              } else {
                if (
                  res[1] < 0 ||
                  res[1] > 255 ||
                  res[2] < 0 ||
                  res[2] > 255 ||
                  res[3] < 0 ||
                  res[3] > 255 ||
                  res[4] < 0 ||
                  res[4] > 255
                ) {
                  callback(new Error("只支持ipv4"));
                  return;
                }
              }

              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: { Tree, Display, Subscribe },
  methods: {
    tabRemove(targetName) {
      let index = this.tabs.keys.findIndex(
        d => this.getTabKey(d) === targetName
      );
      this.tabs.keys.splice(index, 1);
    },
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
      if (this.dialog.add_host.form.name === "") {
        this.$message("连接名称不能为空");
      } else if (this.dialog.add_host.form.host === "") {
        this.$message("仅支持ipv4");
      } else {
        let preg = new RegExp(
          "([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"
        );
        let res = preg.exec(this.dialog.add_host.form.host);
        if (!res || res.length != 5) {
          this.$message("仅支持ipv4");
          return;
        } else {
          if (
            res[1] < 0 ||
            res[1] > 255 ||
            res[2] < 0 ||
            res[2] > 255 ||
            res[3] < 0 ||
            res[3] > 255 ||
            res[4] < 0 ||
            res[4] > 255
          ) {
            this.$message("仅支持ipv4");
            return;
          }
        }
      }

      this.$store
        .dispatch(
          "addHost",
          JSON.parse(JSON.stringify(this.dialog.add_host.form))
        )
        .then(value => {
          this.$message("添加成功");
          this.dialog.add_host.visible = false;

          this.dialog.add_host.form.label = "";
          this.dialog.add_host.form.host = "";
          this.dialog.add_host.form.password = "";
        });

      // this.$db.get("host").push(this.new_host);
    },
    leafClick(data, client) {
      console.log("查找之前");
      console.log(this.tabs.keys);
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
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

.left {
  border: 1px solid red;
}
</style>
