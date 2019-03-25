<template>
  <div id="app">
    <el-container style="height:100%">
      <el-header height="35px;">
        <img
          src="static/img/logo.png"
          style="height:35px;vertical-align:middle;margin-left:-15px;"
          alt="k-redis"
        >
        <span class="title">{{ title }}</span>
        <span class="controller">
          <i class="el-icon-minus" @click="$electron.remote.getCurrentWindow().minimize()"></i>
          <i
            class="el-icon-close"
            @click="()=>{ (!dialog.close.form.exitNotConfirm && (dialog.close.visible = true) ) || close()}"
          ></i>
        </span>
      </el-header>
      <el-main style="height:100%">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 退出程序dialog -->
    <el-dialog :visible.sync="dialog.close.visible" title="退出" width="300px">
      <el-row style="margin-bottom:15px;">确认退出程序？</el-row>
      <el-checkbox style="margin-bottom:15px;" v-model="dialog.close.form.exitNotConfirm">下次不再询问</el-checkbox>
      <el-form label-width="100px" status-icon>
        <el-form-item>
          <el-button type="primary" @click="close">确认</el-button>
          <el-button @click="dialog.close.visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "k",
  data() {
    //获取是否有退出相关配置信息

    console.log(this.$db.get("setting").value());
    console.log(process.versions);
    return {
      title: this.$electron.remote.getCurrentWindow().getTitle(),
      dialog: {
        close: {
          visible: false,
          form: {
            exitNotConfirm: this.$db.get("setting").value().exitNotConfirm
          }
        }
      }
    };
  },
  methods: {
    close() {
      //存储配置信息
      this.$db
        .get("setting")
        .set("exitNotConfirm", this.dialog.close.form.exitNotConfirm)
        .write();
      //退出程序
      console.log("退出程序");
      console.log(this.$db.get("setting").value());
      // console.log(this.$electron);
      this.$electron.remote.app.quit();
    }
  }
};
</script>

<style scaffold>
/* CSS */

.el-header {
  vertical-align: middle;
  line-height: 35px;
  background-color: rgb(60, 60, 60);
  -webkit-app-region: drag;
  z-index: 2002; /*避免被遮罩盖住*/
}
.controller {
  float: right;
}
.controller > i {
  cursor: pointer;
  width: 40px;
  text-align: center;
  line-height: inherit;

  -webkit-app-region: no-drag;
}
.controller > i:hover {
  background-color: rgb(121, 121, 133);
}
</style>
