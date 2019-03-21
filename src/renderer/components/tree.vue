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
  <el-tree
    :data="hosts"
    :props="defaultProps"
    :load="load"
    @node-click="handleNodeClick"
    :expand-on-click-node="false"
    node-key="host"
    lazy
  >
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <span>{{ node.label }}</span>
      <span style="float:right">
        <i class="el-icon-refresh" @click="() => refresh(node,data)"></i>
        <i class="el-icon-plus" @click="() => append(node,data)"></i>
        <i class="el-icon-delete" @click="() => remove(node,data)"></i>
      </span>
    </div>
  </el-tree>
</template>

<script>
export default {
  data() {
    //获取存储的host
    let hosts = this.$db.get("hosts").value();
    console.log(hosts);
    return {
      hosts: hosts,
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        }
      ],
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
            console.log(node);
            const parent = node.parent;
            const children = parent.data.children || parent.childNodes;
            const index = children.findIndex(d => d.data.host === data.host);
            console.log(children);
            children.splice(index, 1);
            console.log(index);

            this.$db
              .get("hosts")
              .remove({ label: data.label })
              .write();

            //从当前数据删除
            console.log(node);
          }
        );
      }
      console.log(node);
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
      console.log(node);
      if (node.level === 0) {
        resolve(this.hosts);
      } else if (node.level === 1) {
        this.$redis.keys(node.data.host, node.data.port, function(err, reply) {
          if (err) throw err;
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

