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

    <div style="position:absolute;bottom:5px">
      <el-button
        size="small"
        style="bottom:5px;"
        type="primary"
        @click="dialog.add_host.visible = true"
      >添加连接</el-button>
      <slot></slot>
    </div>
   <!-- 添加host弹出框 -->
    <el-dialog :visible.sync="dialog.add_host.visible" title="添加连接" width="500px">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接名：" prop="name">
          <el-input
            placeholder="如：localhost"
            size="small"
            :disabled="dialog.add_host.disabled"
            v-model="dialog.add_host.form.label"
          ></el-input>
        </el-form-item>
        <el-form-item label="连接地址：" prop="host">
          <el-input
            placeholder="仅支持ipv4"
            size="small"
            :disabled="dialog.add_host.disabled"
            v-model="dialog.add_host.form.host"
          ></el-input>
        </el-form-item>
        <el-form-item label="连接端口：" prop="host">
          <el-input
            placeholder
            size="small"
            :disabled="dialog.add_host.disabled"
            v-model="dialog.add_host.form.port"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库：" prop="host">
          <el-input
            placeholder="数据库序号"
            size="small"
            :disabled="dialog.add_host.disabled"
            v-model="dialog.add_host.form.index"
          ></el-input>
        </el-form-item>
        <el-form-item label="认证密码：">
          <el-input
            placeholder="可选"
            size="small"
            :disabled="dialog.add_host.disabled"
            v-model="dialog.add_host.form.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">添加连接</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { isIPv4 } from "net";
import operator from './operator';

export default {
  mixins:[operator],
  data() {
    //因为vuex分文件存储，多出一层是文件名
    console.log(this.$store.state.hosts.hosts);
    //获取存储的host
    return {
      dialog: {
        add_host: {
          visible: false,
          disabled: false,
          form: {
            label: "",
            host: "",
            port: "",
            password: "",
            index: 0,
            leaf: false
          }
        }
      },
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
      if (node.level === 2) {
        //叶子节点 ，也就是key
        //传递事件，需要传递父节点
        let key = {
          label: node.parent.data.label,
          key: data.label,
          host: node.parent.data.host,
          port: node.parent.data.port
        };

        if (data.client) {
          //已有client
          this.$emit("leaf-click", key, data.client);
        } else {
          console.log("parent click");
          this.createClient(node.parent.data)
            .then(client => {
              this.$emit("leaf-click", key, client);
              data.client = client;
            })
            .catch(err => {
              console.log(err);
              this.$message(node.parent.data.label + "连接失败");
            });
        }

        // this.$emit("leaf-click", key);
      } else {
        //非叶子节点
        //构造一个redis = client

        if (data.client) {
          let key = {
            label: data.label,
            host: data.host,
            port: data.port,
            leaf: true
          };
          //已有client
          this.$emit("leaf-click", key, data.client);
        } else {
          this.createClient(data)
            .then(client => {
              this.$emit("leaf-click", key, client);
            })
            .catch(() => {
              console.log("触发连接");
              this.$message(data.label + "连接失败");
            });
        }
      }
      return false;
    },
    load(node, resolve) {
      if (node.level === 0) {
        resolve(this.$store.state.hosts.hosts);
      } else if (node.level === 1) {
        console.log("load 1");
        let client = node.client;
        if (!client) {
          client = this.createClient(node.data).then(client => {
            return Promise.resolve(client);
          });
        } else {
          client = Promise.resolve(client);
        }
        client.then(client => {
          client
            .keysAsync("*")
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
              console.log(err);
              this.$message.error(`${node.data.label}连接失败`);
            });
        });
      }
    }
  }
};
</script>

