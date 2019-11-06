<style>
.el-tabs__content:empty {
  border: none !important;
}
.el-main {
  padding: 0 !important;
  overflow: hidden !important;
  position: relative;
}
.el-tabs {
  height: 100%;
}

.el-tabs__header {
  position: absolute !important;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 120;
}
.el-tabs__content {
  margin-top: 38px;
}
.el-tab-pane {
  max-height: 80%;
}
.el-scrollbar__wrap {
  overflow-x: hidden !important;
}
/* .el-scrollbar__thumb {
  background-color: black !important;
} */
</style>

<template>
  <el-container style="height:100%;">
    <el-aside
      :style="{width:this.leftWidth}"
      class="left"
      @mouseup.native="mouseUp"
      @mousemove.native="moving"
    >
      <tree @leaf-click="leafClick" @key-remove="keyRemove">
        <el-button size="small" style="bottom:5px;" @click="dialog.subscribe.visible = true">订阅</el-button>
      </tree>
    </el-aside>

    <el-main @mouseup.native="mouseUp"  @mousemove.native="moving">
      <div
      @mousedown="mouseDown"
        style="height: 100%;position: absolute;left: 0;width: 5px;cursor: col-resize;z-index: 9999;"
      ></div>
      <el-scrollbar style="height:100%;">
        <el-tabs
          v-model="tabs.now"
          type="border-card"
          closable
          @tab-remove="tabRemove"
          v-if="tabs.keys.length>0"
        >
          <el-tab-pane
            :label="getTabKey(item)"
            :name="getTabKey(item)"
            :key="getTabKey(item)"
            v-for="(item) in tabs.keys"
          >
            <subscribe v-if="item.channel" :client="item.client" :channel="item.channel"></subscribe>
            <display :redisKey="item.key" :index="item.index" v-else></display>
          </el-tab-pane>
        </el-tabs>
      </el-scrollbar>
    </el-main>

    <!-- 添加订阅发布框 -->
    <el-dialog :visible.sync="dialog.subscribe.visible" title="添加消息订阅" width="350px">
      <el-form label-width="100px" status-icon>
        <el-form-item label="连接：" prop="name">
          <el-select
            v-model="dialog.subscribe.form.label"
            placeholder="请选择"
            size="small"
            style="width:100%"
          >
            <el-option
              v-for="( item,index ) in $store.state.hosts.hosts"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅频道：" prop="host">
          <el-input placeholder size="small" v-model="dialog.subscribe.form.channel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subscribe">订阅</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import Tree from "./tree";
import Display from "./display/display";
import Subscribe from "./display/subscribe";


export default {
  name: "landing-page",
  components: { Tree, Display, Subscribe },
  data() {

    return {
      leftWidth: "250px",
      tabs: {
        now: "",
        keys: [
          // { label: "", client: "", key: "" }
        ]
      },
      dialog: {
        subscribe: {
          visible: false,
          form: {
            channel: "",
            label: ""
          }
        }
      }
    };
  },

  methods: {
    subscribe() {
      //订阅频道
      if (this.dialog.subscribe.form.label == "") {
        this.$message.error("请选择连接");
      } else if (this.dialog.subscribe.form.channel === "") {
        this.$message.error("请输入要订阅的频道");
      } else {
        console.log(`label=${this.dialog.subscribe.form.label}`);
        //拿到对应的client
        let index = this.$store.state.hosts.hosts.findIndex(
          d => d.label === this.dialog.subscribe.form.label
        );
        let client = this.$redis.redis.createClient(
          this.$store.state.hosts.hosts[index].port,
          this.$store.state.hosts.hosts[index].host
        );
        let item = {
          label: this.dialog.subscribe.form.label,
          channel: this.dialog.subscribe.form.channel,
          client: client
        };
        this.tabs.keys.push(item);

        // this.tabs.now = this.dialog.subscribe.form.label;
        this.setTab(item);
        this.dialog.subscribe.visible = false;
      }
    },
    keyRemove(parent, key) {
      //key被删除
      //查找对应的tab
      console.log("key");
      console.log(key);

      let tab = this.getTabKey(key);
      this.tabRemove(tab);
    },
    tabRemove(targetName) {
      console.log("tab remove");
      let index = this.tabs.keys.findIndex(d => {
        console.log(d);
        return this.getTabKey(d) === targetName;
      });
      if (index === -1) {
        //没有标签
        return;
      }
      //换另一个选中
      if (index !== this.tabs.keys.length - 1) {
        //选中下一个
        this.tabs.now = this.getTabKey(this.tabs.keys[index + 1]);
      } else if (index !== 0) {
        //不是下一个，选择上一个
        this.tabs.now = this.getTabKey(this.tabs.keys[index - 1]);
      }
      //移除当前
      this.tabs.keys.splice(index, 1);
    },
    getTabKey(item) {
      console.log("get tab key");
      console.log(item);
      if (item.channel) return "订阅：" + item.label + "-" + item.channel;
      if (item.key) return item.label + "-" + item.key;
      return item.label;
    },
    setTab(item) {
      console.log("set tag");
      console.log(item);
      if (item.channel) {
        this.tabs.now = "订阅：" + item.label + "-" + item.channel;
      }
    },

    leafClick(data, client) {
      // 判断当前是否有数据
      let index = this.tabs.keys.findIndex(d => {
        console.log(d);
        if (d.key) {//叶子节点，及某个指定的redis数据
          return d.label === data.label && d.key === data.key;
        } else {
          return d.label === data.label;
        }
      });
      // let index = -1;
      console.log(data);
      console.log(`查找的index=${index}`);
      if (index === -1) {
        //新增
        this.tabs.keys.push(data);
      } else {
        // if(data.key)

        // this.$set(this.tabs.keys[index],'key',data.key);
        this.tabs.keys[index].key = data.key;
      }
      this.tabs.now = this.getTabKey(data);
    },
    splitMove(value) {
      console.log("移动的宽度=" + value);
      //获取宽度
      let width = this.leftWidth.split("px")[0];
      console.log(`现在的宽度=${width}`);
      this.leftWidth = parseInt(width) + parseInt(value) + "px";
    },
    mouseUp(e) {
      this.drag = false;
      document.removeEventListener("mouseup", this.mouseUp);
    },
    mouseDown(e) {
      this.drag = true;
      this.mx = e.pageX;
      this.initX = parseInt(this.leftWidth.split("px")[0]);
      document.addEventListener("mouseup", this.mouseUp);
    },
    moving(e) {
      if (this.drag) {
        console.log(
          `e.pageX = ${e.pageX}, this.mx=${this.mx}，变化的x=${parseInt(
            e.pageX - this.mx
          )}`
        );

        // console.log(`现在的宽度=${width}`);

        let width = parseInt(this.initX) + parseInt(e.pageX - this.mx);
        if (width > 200) {
          this.leftWidth =
            parseInt(this.initX) + parseInt(e.pageX - this.mx) + "px";
        } else {
          this.mouseUp();
        }

        // this.$emit("move", e.pageX - this.mx );
        //每次都需要重新定位
      }
    }
  },
  mounted() {}
};
</script>

<style>
.left {
  border-right: 1px solid rgb(170, 183, 197);
}
</style>
