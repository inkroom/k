<style>
</style>

<template>
  <el-row>
    <el-row v-for="(row ,index) in list" :key="index">
      <el-col
        v-for=" (item,i) in row"
        :key="i"
        :md="7"
        :lg="7"
        :sm="7"
        :xs="8"
        style="margin:5px;margin-top:15px;"
      >
        <el-input v-model="item.value" @keyup.enter.native="set(index,i,item.index)"></el-input>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
export default {
  props: {
    redis: {
      type: String,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [
        // [{ index: 1, name: "12" }, { index: 2, name: "123" }]
      ]
    };
  },
  computed: {
    getRowCount() {
      if (this.redis && this.value) {
        return Math.ceil(this.value.length / 3);
      }
      return 0;
    }
  },
  methods: {
    set(row, col, index) {
      this.$emit(
        "command",
        `lset ${this.redis} ${index} ${this.list[row][col].value}`
      );
      this.load();
    },
    load() {
      if (this.redis) {
        // TODO 后期可能需要处理一下超大数据的情况
        this.$redis
          .lrange(this.index, this.redis, 0, -1)
          .then(value => {
            let list = [];
            for (let row = 0; row < Math.ceil(value.length / 3); row++) {
              let col = [];
              for (
                let i = row * 3;
                i < (row + 1) * 3 && i < value.length;
                i++
              ) {
                let temp = { index: i, value: value[i] };
                col.push(temp);
              }
              list.push(col);
            }
            this.list = list;

            this.$set(this, "list", list);
            this.$set(this, "value", value);
          })
          .catch(e => {
            console.log(err);
          });
      }
    }
  },
  watch: {
    redis() {
      this.load();
    }
  },
  mounted() {
    this.load();
  }
};
</script>

