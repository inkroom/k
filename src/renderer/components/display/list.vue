<style>
</style>

<template>
  <el-row>
    <el-row v-if="value.value" v-for="row in getRowCount" :key="row">
      <el-col
        v-for=" (item,index) in filter((row - 1) * 3,row*3) "
        :key="index"
        :md="7"
        :lg="7"
        :sm="7"
        :xs="8"
        style="margin:5px;"
      >
      {{index}}
        <el-input
          v-model="filter((row-1) * 3,((row)*3))[index]"
          @keyup.enter.native="set(row * 3 + index)"
        ></el-input>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      required: false
    },
    client: {
      type: Object,
      required: true
    }
  },
  computed: {
    getRowCount() {
      console.log("---计算");
      if (this.value && this.value.value) {
        console.log("--" + Math.ceil(this.value.value.length / 3));
        return Math.ceil(this.value.value.length / 3);
      }
      return 0;
    }
  },
  methods: {
    set(index) {
      this.$emit(
        "command",
        `lset ${this.value.key} ${index} ${this.value.value[index]}`
      );
      this.load();
    },
    filter(start, end) {
      console.log(`start = ${start} end = ${end}`);
      console.log(this.value.value.slice(start, end));
      return this.value.value.slice(start, end);
    },
    load() {
      if (this.value) {
        // TODO 后期可能需要处理一下超大数据的情况
        this.client.lrange(this.value.key, 0, -1, (err, value) => {
          if (err) console.log(err);
          console.log(value);
          this.$set(this.value, "value", value);
        });
      }
    }
  },
  watch: {
    value() {
      this.load();
    }
  },
  mounted() {
    this.load();
  }
};
</script>

