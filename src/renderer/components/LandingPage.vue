<template>
  <el-container style="height:100%">
    <el-aside width="250px" class="left">
      <tree @leaf-click="leafClick"></tree>
      <el-button
        size="small"
        style="position:absolute;bottom:5px;"
        @click="add_dialog_visible = true"
      >添加</el-button>
    </el-aside>
    <el-main style="border:1px solid blue">
      <display :value="key" v-if="show" :client="client"></display>
    </el-main>

    <!-- 添加host弹出框 -->
    <el-dialog :visible.sync="add_dialog_visible">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接名：" prop="name">
          <el-input placeholder="如：localhost" size="small" v-model="new_host.label"></el-input>
        </el-form-item>
        <el-form-item label="连接地址：" prop="host">
          <el-input placeholder="仅支持ipv4" size="small" v-model="new_host.host"></el-input>
        </el-form-item>
        <el-form-item label="认证密码：">
          <el-input placeholder="可选" size="small" v-model="new_host.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import Tree from "./tree";
import Display from "./display/display";
import { setTimeout } from "timers";

export default {
  name: "landing-page",
  data() {
    return {
      show: false,
      add_dialog_visible: true,
      key: {},
      new_host: {
        label: "2323",
        host: "",
        password: "",
        leaf: false
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
  components: { Tree, Display },
  methods: {
    add() {
      if (this.new_host.name === "") {
        this.$message("连接名称不能为空");
      } else if (this.new_host.host === "") {
        this.$message("仅支持ipv4");
      } else {
        let preg = new RegExp(
          "([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})"
        );
        let res = preg.exec(this.new_host.host);
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
        .dispatch("addHost", JSON.parse(JSON.stringify(this.new_host)))
        .then(value => {
          this.$message("添加成功");
          this.add_dialog_visible = false;

          this.new_host.label = "";
          this.new_host.host = "";
          this.new_host.password = "";
        });

      // this.$db.get("host").push(this.new_host);
    },
    leafClick(data, client) {
      this.show = false;
      this.key = data;
      this.client = client;
      this.show = true;
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
