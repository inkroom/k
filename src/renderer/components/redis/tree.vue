<template>
  <el-tree :data="hosts" :props="defaultProps" :load="load" @node-click="handleNodeClick" lazy></el-tree>
</template>

<script>

import { throws } from "assert";

export default {
  data() {
    //获取存储的host
    let hosts = this.$db.get('hosts').value();
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
    handleNodeClick(data,node) {
        if(node.isLeaf){//叶子节点 ，也就是key
            //传递事件，需要传递父节点
            let key = {
                key:data.label,
                host:node.parent.data.host,
                port:node.parent.data.port
            }

            this.$emit('leaf-click',key);
        }
    },
    load(node, resolve) {
        console.log(node);
      if (node.level === 0) {
        resolve(this.hosts);
      } else if (node.level === 1) {
        this.$redis.keys(node.data.host, node.data.port, function(err, reply) {
          if (err) throw err;
          reply.forEach(element => {
            resolve([{ label: element, leaf: true }]);
          });
        });
      }
    }
  }
};
</script>

