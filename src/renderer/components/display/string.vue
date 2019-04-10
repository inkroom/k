<style lang="scss">
.k-redis-string-value-container {
  max-height: 300px;
  padding-bottom: 15px;
  border: none !important;
  &:focus,
  &:active {
    border: none !important;
  }

  .k-redis-string-value {
    height: 100%;
    border: none !important;
    padding-bottom: 15px;
    padding:-1px;
    &:focus,
    &:active {
      border: none !important;
    }
  }
  *[contenteditable]{
    outline: 0;
    cursor: text;
  }
}
</style>

<template>
  <el-row style="margin-top:15px;padding-right:0;" class="el-textarea__inner">
    <el-scrollbar style class="el-textarea">
      <div class="k-redis-string-value-container" style>
        <div class="k-redis-string-value" style="border:none" contenteditable="true" >{{ value }}</div>
      </div>
      <!-- <el-input type="textarea" rows="10" style="max-height:150px;" v-model="value"></el-input> -->
    </el-scrollbar>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      value: ""
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
