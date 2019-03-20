<style>
.el-input__inner {
  padding: 0;
}
</style>


<template>
  <div>
    <el-row>
      <el-col :md="2" :sm="2" :xs="2">
        <span>name：</span>
      </el-col>
      <el-col :md="13" :sm="11" :xs="6">
        <el-input v-model="value.key" size="mini"></el-input>
      </el-col>
      <el-col :md="9" :sm="11" :xs="16">
        <span>TTL: {{ ttl }}</span>
        <el-button size="mini">重命名</el-button>
        <el-button size="mini">删除</el-button>
        <el-button size="mini">修改</el-button>
      </el-col>
    </el-row>
    <el-row v-if="type==='string'" style="margin-top:15px;">
      <el-input type="textarea" v-model="value.value"></el-input>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      type: "",
      ttl: "-1",
      name: ""
    };
  },
  mounted() {
    console.log("-0-----");
    console.log(this.value);
  },
  watch: {
    value(nv) {
      let _this = this;
      console.log(nv);
      if (nv !== "") {
        //解析数据
        this.$redis.type(nv.host, nv.port, nv.key, (err, v) => {
          this.type = v;
          console.log(v);
          if (this.type === "string") {
            this.$redis.get(nv.host, nv.port, nv.key, (err, value) => {
              console.log('获取的value='+value);
              console.log(this);
              this.value.value = value;
            });
          }
        });


        this.$redis.ttl(nv.host, nv.port, nv.key, (err,value) => {
          //启动定时器
          this.ttl = value;
          if (this.ttl !== -1)
            setTimeout(() => {
              this.ttl -= 1;
            }, 1000);
        });
      }
    }
  }
};
</script>
