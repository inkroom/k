<template></template>

<script>
export default {
  methods: {
    remove(node, data) {
      if (node.level === 1) {
        //host，此时为删除数据
        this.$confirm("确认删除连接-" + node.data.label + "?", "删除链接", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (data.client) {
              console.log("client end");
              //关闭连接 使用end不会触发end事件
              data.client.end(true);
              // data.client.quit();
            }
            this.$store
              .dispatch("removeHost", data.label)
              .then(value => {
                this.$message("删除成功");
                this.$emit("key-remove", node.parent, {
                  label: data.label,
                  key: data.label
                });
              })
              .catch(value => {
                console.log(value);
                this.$message.error("删除失败");
              });
          })
          .catch(() => {});
      } else if (node.level === 2) {
        this.$confirm("确认删除数据-" + data.label + "?", "删除", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let client = data.client || data.parent.client;
          if (!client) {
            //删除key
            client = this.createClient(data.parent);
          }
          let temp = client;
          if (client.then) {
            temp = client;
          } else {
            temp = client.delAsync(data.label);
          }
          temp
            .then(() => {
              //删除key
              this.$message("删除成功");
              this.$refs.tree.remove(node);
              this.$emit("key-remove", node.parent, {
                label: data.parent.label,
                key: data.label
              });
            })
            .catch(err => {
              console.log("删除失败");
              this.$message.error(`${data.label}删除失败`);
            });

          // let index  = node.parent.data.children.findIndex((d)=> d.label === data.label );
          // node.parent.data.children.splic(index,1);
          //通知上级已关闭对应的tab
        });
      }
    },
    add() {
      if (this.dialog.add_host.disabled) {
        this.dialog.add_host.visible = false;
        return;
      }
      console.log(this.dialog.add_host.form);
      console.log(this.dialog.add_host.form.name);
      console.log(this.dialog.add_host.form.name === "");
      if (this.dialog.add_host.form.label === "") {
        this.$message("连接名称不能为空");
      } else if (!isIPv4(this.dialog.add_host.form.host)) {
        this.$message("仅支持ipv4");
      } else if (isNaN(parseInt(this.dialog.add_host.form.port))) {
        this.$message("端口1-25535");
      } else if (
        parseInt(this.dialog.add_host.form.port) < 1 ||
        parseInt(this.dialog.add_host.form.port) > 65535
      ) {
        console.log(parseInt(this.dialog.add_host.form.port));
        this.$message("端口1-25535");
      } else {
        //判断重名
        let index = this.$store.state.hosts.hosts.findIndex(
          d => d.label === this.dialog.add_host.form.label
        );
        if (index !== -1) {
          this.$message(`${this.dialog.add_host.form.label}已存在`);
          return;
        }
        console.log("添加host");
        console.log(this.dialog.add_host.form);
        console.log(JSON.parse(JSON.stringify(this.dialog.add_host.form)));

        let res = this.$store.dispatch(
          "addHost",
          Object.assign({}, this.dialog.add_host.form)
          // JSON.parse(JSON.stringify(this.dialog.add_host.form))
        );
        res
          .then(value => {
            this.dialog.add_host.visible = false;

            this.dialog.add_host.form.label = "";
            this.dialog.add_host.form.host = "";
            this.dialog.add_host.form.password = "";
            this.dialog.add_host.form.port = "";

            console.log("添加成功");
            this.$message("添加成功");
          })
          .catch(err => {
            console.log(err);
            this.$message.error("添加失败");
          });
      }
    },
     refresh(node, data) {
      if (node.level === 1) {
        //host
        let client = data.client;
        if (!client) {
          client = this.createClient(data).then(client => {
            return Promise.resolve(client);
          });
        } else {
          client = Promise.resolve(client);
        }

        client.then(client => {
          client
            .keysAsync("*")
            .then(value => {
              let keys = [];
              value.forEach(e => {
                keys.push({
                  label: e,
                  host: data.host,
                  port: data.port,
                  left: true,
                  isLeaf: true,
                  client: client
                });
              });
              var theChildren = node.childNodes;
              theChildren.splice(0, theChildren.length);
              //FIXME  新刷新出来的key带有下拉按钮，不被认为是叶子节点
              node.doCreateChildren(keys);
              console.log("host refresh");
              console.log(value);
            })
            .catch(err => {
              this.$message.error(`${data.label}刷新失败`);
            });
        });
      } else if (node.level === 1) {
        //key
      }
    },
    createClient(data) {
      return new Promise((resolve, reject) => {
        let options = {
          port: data.port,
          host: data.host,
          retry_strategy: value => {
            if (value.code === "ECONNREFUSED") {
              //此时不重试
            }
            //FIXME: 无法触发error事件
            return new Error(`${value.address}无法连接`);
          }
        };

        console.log(options);
        if (data.index !== 0) {
          options.db = data.index;
        }
        if (data.password !== "") {
          options.password = data.password;
        }
        let client = this.$redis.redis
          .createClient(options)
          .on("error", err => {
            console.log("event error");
            this.$message.error(`${data.label}连接出现错误`);
            reject(err);
          })
          .on("ready", () => {
            resolve(client);
          })
          .on("end", () => {
            console.log("redis end");
            this.$alert(`${data.label}连接已断开`);
            reject();
          });
        data.client = client;
      });
    }
  }
};
</script>
