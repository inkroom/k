<template>
  <el-row style="margin-top:15px;">
    <el-input type="textarea" v-model="value"></el-input>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    };
  },
  props: {
    redis: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    },
    client: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.redis || (this.type && this.type === "string")) {
      this.client.get(this.redis, (err, value) => {
        this.value = value;
        // this.$set(this, "value", value);
      });
    }
  }
};
</script>
