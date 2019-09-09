<template>
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
    <el-form-item label="主题">
      <el-radio v-model="dialog.bg.form.mode" label="dark">黑色</el-radio>
      <el-radio v-model="dialog.bg.form.mode" label="light">白色</el-radio>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="setBg">确认</el-button>
      <el-button @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        bg: {
          form: this.$db.get("bg").value() || {
            type: "1",
            interval: "",
            dir: "",
            mode:'dark'
          }
        }
      }
    };
  },
  methods: {
    close() {
      this.$emit("close");
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
    },
    setBg() {
      if (this.dialog.bg.form.dir === "") {
        this.$message.error("图片路径不能为空");
      } else if (this.dialog.bg.form.interval === "") {
        this.$message.error("切换时间间隔不能为空");
      } else if (isNaN(parseInt(this.dialog.bg.form.interval))) {
        this.$message.error("切换时间间隔不能为空");
      } else {
        this.$message("设置成功");
        //写入数据库
        this.$db.set("bg", this.dialog.bg.form).write();

        this.$emit("bg-change", Object.assign({}, this.dialog.bg.form));
        // this.getNextBg();
      }
    }
  }
};
</script>

<style>
</style>
