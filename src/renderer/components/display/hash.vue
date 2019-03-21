<template>
  <el-row v-if="value" style="margin-top:15px;">
    <el-row v-for="(item ,key) in value.value" :key="key" :gutter="10" style="margin-top:5px;">
      <el-col :md="11">
        <el-input v-model="key" @keyup.enter.native="renameField(key)"></el-input>
      </el-col>
      <!-- {{item}} -->
      <el-col :md="11">
        <el-input v-model="value.value[key]" @keyup.enter.native="set(key)"></el-input>
      </el-col>
      <el-col :md="2">
        <div>
          <i class="el-icon-error" @click="delField(key)"></i>
        </div>
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
  methods: {
    renameField(field) {
      //   this.$emit("command");
    },
    set(field) {
      if (this.value.type === "hash")
        this.$emit(
          "command",
          `hset ${this.value.key} ${field} ${this.value.value[field]}`
        );
      else if (this.value.type === "zset") {
      }
      this.load();
    },
    delField(field) {
      if (this.value.type === "hash")
        this.$emit("command", `HDEL ${this.value.key} ${field}`);
      else if (this.value.type === "zset") {
        this.$emit("command", `zrem ${this.value.key} ${field}`);
      }
      this.load();
    },
    load() {
      if (this.value&& this.value.type === 'hash'&& this.value.type === 'zset') {
        if (this.value.type === "hash") {
          this.client.hgetall(this.value.key, (err, value) => {
            this.$set(this.value, "value", value);
          });
        } else if (this.value.type === "zset") {
          this.client.zrange(
            this.value.key,
            0,
            -1,
            "WITHSCORES",
            (err, value) => {
              if (err) console.log(err);
              let res = {};
              for (let i = 0; i < value.length; i += 2) {
                res[value[i]] = value[i + 1];
              }
              this.$set(this.value, "value", res);
            }
          );
        }
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
<style>
.el-icon-error {
  cursor: pointer;
}
</style>

