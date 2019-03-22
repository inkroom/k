<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<template>
   <!-- :data="hosts" -->
  <el-tree
    :data="$store.state.hosts.hosts"
    :props="defaultProps"
    :load="load"
    @node-click="handleNodeClick"
    :expand-on-click-node="false"
    lazy
  >
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <span>{{ node.label }}</span>
      <span style="float:right">
        <i class="el-icon-refresh" @click="() => refresh(node,data)"></i>
        <i class="el-icon-plus" @click="() => append(node,data)" v-if="node.level==1"></i>
        <i class="el-icon-delete" @click="() => remove(node,data)"></i>
      </span>
    </div>
  </el-tree>
</template>

<script>
export default {
  data() {

      //FIXME: 未知原因导致数据存储突然多出一层
    console.log(this.$store.state.hosts.hosts);
    //获取存储的host
    return {
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      }
    };
  },
  methods: {
    append(node, data) {},
    refresh(node, data) {},
    remove(node, data) {
      if (node.level === 1) {
        //host，此时为删除数据
        this.$confirm(`确认删除连接-${node.data.label}?`, "删除链接").then(
          () => {
            console.log('发送删除')
            console.log(this.$store)
            this.$store.dispatch('removeHost',data.label).then((value)=>{
console.log(`返回的结果${value}`)
this.$message('删除成功');
            });

          }
        );
      }
    },
    handleNodeClick(data, node) {
      if (node.isLeaf) {
        //叶子节点 ，也就是key
        //传递事件，需要传递父节点
        let key = {
          key: data.label,
          host: node.parent.data.host,
          port: node.parent.data.port
        };

        //构造一个redis = client
        let client = this.$redis.redis
          .createClient(node.parent.data.port, node.parent.data.host)
          .on("ready", () => {
            this.$emit("leaf-click", key, client);
            this.show = true;
          })
          .on("error", () => {
            this.$message(node.parent.data.label + "连接失败");
          });
        // this.$emit("leaf-click", key);
      } else {
        //非叶子节点
        //构造一个redis = client
        let client = this.$redis.redis
          .createClient(node.data.port, node.data.host)
          .on("ready", () => {
            console.log("client");
            console.log(client);
            this.$emit("leaf-click", null, client);
            this.show = true;
          })
          .on("error", () => {
            this.$message(node.parent.data.label + "连接失败");
          });
      }
    },
    load(node, resolve) {
      if (node.level === 0) {
        resolve(this.$store.state.hosts.hosts);
      } else if (node.level === 1) {
        let _this = this;
        this.$redis.keys(node.data.host, node.data.port, function(err, reply) {
          if (err){
            _this.$message('连接错误');
            resolve([]);
          }
          console.log(reply);
          if (reply.length == 0) {
            resolve([]);
          }

          let result = [];
          reply.forEach(element => {
            result.push({ label: element, leaf: true });
          });
          resolve(result);
        });
      }
    }
  }
};
</script>

