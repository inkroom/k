<template>
  <el-row v-if="value && type=='string'" style="margin-top:15px;">
    <el-input type="textarea" v-model="value.value"></el-input>
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
  mounted() {
    if (this.value) {
      this.client.get(this.value.key, (err, value) => {
        this.$set(this.value, "value", value);
      });
    }
  }
};
</script>
