<template>
  <!-- 添加host弹出框 -->
  <el-dialog :visible.sync="dialog.add_host.visible" title="添加连接" width="500px">
    <el-form label-width="100px" status-icon>
      <el-form-item label="连接名：" prop="name">
        <el-input
          placeholder="如：localhost"
          size="small"
          :disabled="dialog.add_host.disabled"
          v-model="dialog.add_host.form.label"
        ></el-input>
      </el-form-item>
      <el-form-item label="连接地址：" prop="host">
        <el-input
          placeholder="仅支持ipv4"
          size="small"
          :disabled="dialog.add_host.disabled"
          v-model="dialog.add_host.form.host"
        ></el-input>
      </el-form-item>
      <el-form-item label="连接端口：" prop="host">
        <el-input
          placeholder
          size="small"
          :disabled="dialog.add_host.disabled"
          v-model="dialog.add_host.form.port"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据库：" prop="host">
        <el-input
          placeholder="数据库序号"
          size="small"
          :disabled="dialog.add_host.disabled"
          v-model="dialog.add_host.form.index"
        ></el-input>
      </el-form-item>
      <el-form-item label="认证密码：">
        <el-input
          placeholder="可选"
          size="small"
          :disabled="dialog.add_host.disabled"
          v-model="dialog.add_host.form.password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">添加连接</el-button>
        <el-button  @click="dialog.add_host.visible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { isIPv4 } from "net";
export default {
  data() {
    return {
      dialog: {
        add_host: {
          visible: true,
          disabled: false,
          form: {
            label: "",
            host: "",
            port: "",
            password: "",
            index: 0,
            leaf: false
          }
        }
      }
    };
  },
  watch: {
    "dialog.add_host.visible"(nv) {
      if (!nv) {
        this.$emit("close");
      }
    }
  },
  methods: {
    add() {
      if (this.dialog.add_host.disabled) {
        this.dialog.add_host.visible = false;
        return;
      }
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
        //判断重名
        let index = this.$store.state.hosts.hosts.findIndex(
          d => d.label === this.dialog.add_host.form.label
        );
        if (index !== -1) {
          this.$message(`${this.dialog.add_host.form.label}已存在`);
          return;
        }
        console.log("添加host");
        console.log(this.dialog.add_host.form);
        console.log(JSON.parse(JSON.stringify(this.dialog.add_host.form)));

        let res = this.$store.dispatch(
          "addHost",
          Object.assign({}, this.dialog.add_host.form)
          // JSON.parse(JSON.stringify(this.dialog.add_host.form))
        );
        res
          .then(value => {
            this.dialog.add_host.visible = false;

            this.dialog.add_host.form.label = "";
            this.dialog.add_host.form.host = "";
            this.dialog.add_host.form.password = "";
            this.dialog.add_host.form.port = "";

            console.log("添加成功");
            this.$message("添加成功");
          })
          .catch(err => {
            console.log(err);
            this.$message.error("添加失败");
          });
      }
    }
  }
};
</script>

<style>
</style>
