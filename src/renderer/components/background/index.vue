<template>
  <div>
    <div id="bg" style="overflow:hidden">
      <img :src="bg.path" alt>
    </div>
    <!-- 背景图片选择dialog  -->
    <el-dialog :visible.sync="dialog.bg.visible" title="选择背景图片" width="500px">
      <config-dialog
        v-if="dialog.bg.visible"
        @bg-change="()=>{this.dialog.bg.visible = false;this.getNextBg();}"
        @close="()=>this.dialog.bg.visible=false"
      ></config-dialog>
    </el-dialog>
  </div>
</template>

<script>
import configDialog from "./configDialog";

import fs from "fs";
import path from "path";

export default {
  components: { configDialog },
  data() {
    return {
      bg: {
        path: "",
        index: -1,
        width: "",
        height: "",
        interval_index: -1
      },
      dialog: {
        bg: {
          visible: false
        }
      }
    };
  },
  mounted() {
    this.getNextBg();
  },
  methods: {
    showSetBg() {
      this.dialog.bg.visible = true;
    },
    getNextBg() {
      let bg = this.$db.get("bg").value();
      console.log("数据库的数据");
      console.log(bg);
      if (bg.dir === "") {
        this.bg.path = "static/img/bg.jpg";
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
    }
  }
};
</script>

<style>
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
</style>
