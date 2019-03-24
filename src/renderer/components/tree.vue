<style>
import { resolve } from 'url';
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
    node-key="label"
    @node-click="handleNodeClick"
    :expand-on-click-node="true"
    lazy
    ref="tree"
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
    createClientSync(data) {
      let client = this.$redis.redis
        .createClient(data.port, data.host)
        .on("error", err => {
          this.$message.error(`${data.label}连接出现错误`);
        })
        .on("ready", () => {
          //密码认证
          if (data.password && data.password !== "") {
            client.auth(data.password, err => {
              if (err) {
                console.log(err);
                this.$message.error(`${data.label}认证失败`);
                client.quit();
              } else {
                client.select(data.index, err => {
                  if (err) {
                    console.log(err);
                    this.$message.error(
                      `${data.label}切换到第${data.index}数据库失败`
                    );
                    client.quit();
                  }
                });
              }
            });
          }
          //切换到指定数据库
          if (data.index !== 0) {
            client.select(data.index, err => {
              if (err) {
                console.log(err);
                this.$message.error(
                  `${data.label}切换到第${data.index}数据库失败`
                );
                client.quit();
              }
            });
          }
        });
      data.client = client;
      return client;
    },
    createClient(data){
let client = this.$redis.redis
        .createClient(data.port, data.host)
        .on("error", err => {
          this.$message.error(`${data.label}连接出现错误`);
        })
        .on("ready", () => {
          //密码认证
          if (data.password && data.password !== "") {
            client.auth(data.password, err => {
              if (err) {
                console.log(err);
                this.$message.error(`${data.label}认证失败`);
                client.quit();
              } else {
                client.select(data.index, err => {
                  if (err) {
                    console.log(err);
                    this.$message.error(
                      `${data.label}切换到第${data.index}数据库失败`
                    );
                    client.quit();
                  }
                });
              }
            });
          }
          //切换到指定数据库
          if (data.index !== 0) {
            client.select(data.index, err => {
              if (err) {
                console.log(err);
                this.$message.error(
                  `${data.label}切换到第${data.index}数据库失败`
                );
                client.quit();
              }
            });
          }
        });
      data.client = client;
      return new Promise((resolve,reject)=>{
        
      })
    },
    append(node, data) {},
    refresh(node, data) {
      if (node.level === 1) {
        //host
        console.log(this.$redis);
        let client = data.client || this.createClient(data);
        client.keys("*", (err, value) => {
          if (err) {
            this.$message.error(`${data.label}刷新失败`);
          } else {
            console.log(value);
          }
        });
      } else if (node.level === 1) {
        //key
      }
    },
    remove(node, data) {
      if (node.level === 1) {
        //host，此时为删除数据
        this.$confirm("确认删除连接-" + node.data.label + "?", "删除链接", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (data.client) {
            //关闭连接
            data.client.quit();
          }
          this.$store
            .dispatch("removeHost", data.label)
            .then(value => {
              this.$message("删除成功");
            })
            .catch(value => {
              throw value;
              console.log(value);
              this.$message.error("删除失败");
            });
        });
      } else if (node.level === 2) {
        //删除key

        this.$confirm("确认删除数据-" + data.label + "?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log("key remote");
          console.log(node);
          console.log(data);

          //删除key

          this.$refs.tree.remove(node);
          let client = data.client || data.parent.client;
          if (!client) {
            //删除key
            client = this.createClient(data.parent);
          }
          client.del(data.label);
          // let index  = node.parent.data.children.findIndex((d)=> d.label === data.label );
          // node.parent.data.children.splic(index,1);
          //通知上级已关闭对应的tab

          this.$emit("key-remove", node.parent, {
            label: data.parent.label,
            key: data.label
          });
        });
      }
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
          //构造一个redis = client
          let client = this.$redis.redis
            .createClient(node.parent.data.port, node.parent.data.host)
            .on("ready", () => {
              //挂入缓存
              data.client = client;
              this.$emit("leaf-click", key, client);
              this.show = true;
            })
            .on("error", () => {
              this.$message(node.parent.data.label + "连接失败");
            });
        }

        // this.$emit("leaf-click", key);
      } else {
        //非叶子节点
        //构造一个redis = client
        let client = this.$redis.redis
          .createClient(data.port, data.host)
          .on("ready", () => {
            this.$emit("leaf-click", data, client);
            this.show = true;
          })
          .on("error", () => {
            this.$message(data.label + "连接失败");
          });
      }
    },
    load(node, resolve) {
      if (node.level === 0) {
        resolve(this.$store.state.hosts.hosts);
      } else if (node.level === 1) {
        this.$redis.keys(node.data.host, node.data.port, (err, reply) => {
          if (err) {
            this.$message("连接错误");
            resolve([]);
            return;
          }
          console.log(reply);
          if (reply.length == 0) {
            resolve([]);
            return;
          }
          let result = [];
          reply.forEach(element => {
            result.push({
              label: element,
              leaf: true,
              parent: node.parent.data[0] //不知道为什么是一个数组
            });
          });
          resolve(result);
        });
      }
    }
  }
};
</script>

