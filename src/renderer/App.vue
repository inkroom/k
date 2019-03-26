<template>
  <div id="app">
    <div id="bg" style="overflow:hidden">
      <img :src="bg.path" alt>
    </div>
    <!-- <img id="bg" :src="bg.path"> -->
    <el-container style="height:100%">
      <el-header height="35px;">
        <img
          src="static/img/logo.png"
          style="height:35px;vertical-align:middle;margin-left:-15px;cursor:pointer"
          alt="k-redis"
          @click="dialog.bg.visible=true"
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
    <!-- 背景图片选择dialog  -->
    <el-dialog :visible.sync="dialog.bg.visible" title="选择背景图片" width="500px">
      <el-form label-width="150px" status-icon>
        <el-form-item label="图片路径：">
          <!-- <el-input
            type="small"
            @click="choose"
            placeholder="只支持文件夹"
            size="small"
            v-model="dialog.bg.form.dir"
            @keyup.native="()=>{return false}"
            @keydown.native="()=>{return false}"
          ></el-input>-->
          <!-- 使用input的样式，前提是必须存在el-input，否则样式不会被引入 -->
          <div class="el-input el-input--small">
            <span
              class="el-input__inner"
              @click="choose"
            >{{ dialog.bg.form.dir===''?'只支持文件夹，且不能存放非图片文件':dialog.bg.form.dir }}</span>
          </div>
        </el-form-item>
        <el-form-item label="循环方式：">
          <el-radio v-model="dialog.bg.form.type" label="1">随机</el-radio>
          <el-radio v-model="dialog.bg.form.type" label="2">顺序</el-radio>
        </el-form-item>
        <el-form-item label="循环间隔：">
          <el-input placeholder="单位：秒" v-model="dialog.bg.form.interval" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setBg">确认</el-button>
          <el-button @click="dialog.bg.visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import fs from "fs";
import path from "path";

export default {
  name: "k",
  data() {
    //获取是否有退出相关配置信息

    console.log(this.$db.get("setting").value());
    console.log(process.versions);
    return {
      bg: {
        path: "",
        index: -1,
        width: "",
        height: "",
        interval_index: -1
      },
      title: this.$electron.remote.getCurrentWindow().getTitle(),
      dialog: {
        bg: {
          visible: false,
          form: {
            type: "1",
            interval: "",
            dir: ""
          }
        },
        close: {
          visible: false,
          form: {
            exitNotConfirm: this.$db.get("setting").value().exitNotConfirm
          }
        }
      }
    };
  },
  mounted() {
    this.getNextBg();
  },
  methods: {
    setBg() {
      if (this.dialog.bg.form.dir === "") {
        this.$message.error("图片路径不能为空");
      } else if (this.dialog.bg.form.interval === "") {
        this.$message.error("切换时间间隔不能为空");
      } else if (isNaN(parseInt(this.dialog.bg.form.interval))) {
        this.$message.error("切换时间间隔不能为空");
      } else {
        this.$message("添加成功");
        this.dialog.bg.visible = false;
        //写入数据库
        this.$db.set("bg", this.dialog.bg.form).write();
        this.getNextBg();
      }
    },
    getNextBg() {
      let bg = this.$db.get("bg").value();
      console.log("数据库的数据");
      console.log(bg);
      if (bg.dir === "") {
        this.bg.path = "static/img/k094.jpg";
        return this.bg.path;
      } else {
        //启动定时
        if (this.bg.interval_index === -1) {
          this.bg.interval_index = setInterval(
            this.getNextBg,
            bg.interval * 1000
          );
          console.log(`启动定时=${bg.interval}`);
        }

        //获取type
        // let fs = require("fs");

        if (!fs.existsSync(bg.dir)) {
          console.log(`${bg.dir}不存在`);
          this.bg.path = "static/img/k094.jpg";
          return this.bg.path;
        }
        fs.readdir(bg.dir, (err, files) => {
          if (err) {
            this.bg = "static/img/k094.jpg";
            console.log(err);
            return;
          } else {
            let count = files.length;
            let imgPath = "";
            if (bg.type === "1") {
              //随机
              var Range = count - 1;
              var Rand = Math.random();
              var num = Math.round(Rand * Range); //四舍五入
              // console.log(this.$electron.remote.app.getPath(bg.dir,files[num]))
              console.log(
                `路径随机= file://${path.resolve(bg.dir, files[num])}`
              );
              imgPath = path.resolve(bg.dir, files[num]);
              this.bg.path = "file://" + path.resolve(bg.dir, files[num]);
            } else if (bg.type === "2") {
              //顺序
              // if (!this.bg.index) this.bg.index = 0;
              console.log(
                `路径顺序= file://${path.resolve(
                  bg.dir,
                  files[++this.bg.index % count]
                )}`
              );
              imgPath = path.resolve(bg.dir, files[this.bg.index++ % count]);
              this.bg.path =
                "file://" +
                path.resolve(bg.dir, files[this.bg.index++ % count]);
            }
            //计算图片宽高
            console.log(this.bg.path);
          }
        });
      }
    },
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
    },
    choose() {
      console.log("文件选择");
      //选择文件夹
      this.$electron.remote.dialog.showOpenDialog(
        this.$electron.remote.getCurrentWindow(),
        { properties: ["openDirectory", "multiSelections"] },
        paths => {
          if (paths && paths.length > 0) {
            //存储数据
            this.dialog.bg.form.dir = paths[0];
          }
          console.log(paths);
        }
      );
    }
  }
};
</script>

<style scaffold>
/* CSS */

#bg {
  z-index: 199; /*弹窗为200，标题为201*/
  position: fixed;
  top: 35px;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0.1;
  pointer-events: none; /* 关键属性，图片浮在所有层上方，该属性使得图片不能触发事件，事件穿透到下层 */
}
#bg > img {
  min-width: 100%;
  min-height: 100%;
}

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
