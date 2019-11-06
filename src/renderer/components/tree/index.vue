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

  <div style="height:100%;position:relative;padding-bottom:30px;box-sizing:border-box">
    <el-scrollbar style="height:98%;margin-bottom:30px;">
      <el-tree
        :data="$store.state.hosts.hosts"
        :props="defaultProps"
        :load="load"
        node-key="label"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :lazy="true"
        ref="tree"
        style="overflow-x:auto"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span style="float:right">
            <!-- <i class="el-icon-edit" @click="() => edit(node,data)" v-if="node.level===1"></i> -->
            <i class="el-icon-refresh" @click="() => refresh(node,data)"></i>
            <!-- <i class="el-icon-plus" @click="() => append(node,data)" v-if="node.level===1"></i> -->
            <i class="el-icon-delete" @click="() => remove(node,data)"></i>
          </span>
        </div>
      </el-tree>
    </el-scrollbar>

    <div style="position:absolute;bottom:10px;left:10px;">
      <el-button
        size="small"
        style="bottom:5px;"
        type="primary"
        @click="dialog.add_host.visible = true"
      >添加连接</el-button>
      <slot></slot>
    </div>
    <add-host v-if="dialog.add_host.visible" @close="()=>this.dialog.add_host.visible=false"></add-host>
  </div>
</template>

<script>
import operator from "./operator";
import addHost from "./addHost";
export default {
  components: { addHost },
  mixins: [operator],
  data() {
    //因为vuex分文件存储，多出一层是文件名
    console.log(this.$store.state.hosts.hosts);
    //获取存储的host
    return {
      dialog: { add_host: { visible: false } },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      }
    };
  },
  methods: {
    append(node, data) {},

    edit(node, data) {
      //构造新的数据
      //不修改，只能删了重来
      for (let key in data) {
        this.dialog.add_host.form[key] = data[key];
      }

      //显示
      this.dialog.add_host.disabled = true;
      this.dialog.add_host.visible = true;
    },
    handleNodeClick(data, node) {
      console.log('node click',node)
      console.log('node' ,data);
      if (node.level === 2) {
        //叶子节点 ，也就是key
        //传递事件，需要传递父节点

        let emitData = {
          label: node.parent.data.label,
          host: node.parent.data.host,
          port: node.parent.data.port,
          key: data.label,
          index: data.index
        };

        if (data.poolIndex) {
          console.log('已有index')
          //已有client
          this.$emit("leaf-click", emitData);
        } else {
          console.log("parent click");
          this.createClient(node.parent.data).then((key, client) => {
            data.poolIndex = key;
            emitData.index = key;

            this.$emit("leaf-click", emitData);
          });
        }

        // this.$emit("leaf-click", key);
      } else {
        //非叶子节点
        //构造一个redis = client

        let emitData = {
          label: data.label,
          host: data.host,
          port: data.port,
          leaf: true,
          index: data.poolIndex
        };

        if (data.poolIndex) {
          //已有client
          this.$emit("leaf-click", emitData);
        } else {
          this.createClient(data).then((index, client) => {
            data.poolIndex = index;
            emitData.index = index;
            this.$emit("leaf-click", emitData);
          });
        }
      }
      return false;
    },
    load(node, resolve) {
      console.log('开始load')
      if (node.level === 0) {
        resolve(this.$store.state.hosts.hosts);
      } else if (node.level === 1) {
        console.log("load 1",node);
        let client = Promise.resolve(node.poolIndex);
        if (!node.poolIndex) {
          client = this.createClient(node.data).then((index, client) => {
            
            node.poolIndex = index;
            //TODO 此处待商榷
            // this.$emit("leaf-click", key);
            return index;
          });
        }

        client.then(index => {
          this.$redis
            .keysAsync(index, "*")
            .then(reply => {
              if (reply.length == 0) {
                resolve([]);
              } else {
                let result = [];
                reply.forEach(element => {
                  result.push({
                    label: element,
                    leaf: true,
                    parent: node.parent.data[0] //不知道为什么是一个数组
                  });
                });
                resolve(result);
              }
            })
            .catch(err => {
              resolve([]);
            });
        });
      }
    }
  }
};
</script>

