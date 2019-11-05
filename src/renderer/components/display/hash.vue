<template>
  <el-row v-if="value" style="margin-top:15px;">
    <el-row v-for="(item,key) in value" :key="key" :gutter="10" style="margin-top:5px;">
      <el-col :md="11" :sm="11" :xs="11">
        <el-input :value="key" @keyup.enter.native="renameField(key)" readonly=""></el-input>
      </el-col>
      <!-- {{item}} -->
      <el-col :md="11" :sm="11" :xs="11">
        <el-input v-model="value[key]" @keyup.enter.native="set(key)"></el-input>
      </el-col>
      <el-col :md="2" :sm="2" :xs="2">
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
    redis: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    client: {
      type: Object,
      required: true
    }
  },
  data() {
    return { value: null };
  },
  methods: {
    renameField(field) {
      //   this.$emit("command");
    },
    set(field) {
      if (this.type === "hash")
        this.$emit(
          "command",
          `hset ${this.redis} ${field} ${this.value[field]}`
        );
      else if (this.type === "zset") {
      }
      this.load();
    },
    delField(field) {
      if (this.type === "hash")
        this.$emit("command", `HDEL ${this.redis} ${field}`);
      else if (this.type === "zset") {
        this.$emit("command", `zrem ${this.redis} ${field}`);
      }
      this.load();
    },
    load() {
      console.log(`type = ${this.type}`)
      if (this.redis && (this.type === "hash" || this.type === "zset")) {
        if (this.type === "hash") {
          this.client.hgetall(this.redis, (err, value) => {
            this.$set(this, "value", value);
            console.log('buffer ',(value['creationTime']))
            console.log('hash value = ',value);
          });
        } else if (this.type === "zset") {
          this.client.zrange(this.redis, 0, -1, "WITHSCORES", (err, value) => {
            if (err) console.log(err);
            let res = {};
            for (let i = 0; i < value.length; i += 2) {
              res[value[i]] = value[i + 1];
            }
            console.log(res);
            this.$set(this, "value", res);
          });
        }
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
<style>
.el-icon-error {
  cursor: pointer;
}
</style>

