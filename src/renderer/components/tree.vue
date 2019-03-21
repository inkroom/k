<template>
  <el-tree :data="hosts" :props="defaultProps" :load="load" @node-click="handleNodeClick" lazy></el-tree>
</template>

<script>
import { throws } from "assert";

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

