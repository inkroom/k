<style>
.el-input__inner {
  padding: 0;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  color: black !important;
}
</style>


<template>
  <div>
    <el-row v-if="value">
      <el-col :md="2" :sm="2" :xs="2">
        <span>name：</span>
      </el-col>
      <el-col :md="13" :sm="11" :xs="6">
        <!-- <span>{{value.key}}</span> -->

        <el-input v-model="value.key" size="mini" disabled></el-input>
      </el-col>
      <el-col :md="9" :sm="11" :xs="16">
        <span>TTL: {{ ttl }}</span>
        <el-button size="mini" @click.native="rename">重命名</el-button>
        <el-button size="mini" @click.native="del">删除</el-button>
        <el-button size="mini" @click.native="set">修改</el-button>
      </el-col>
    </el-row>
    <k-string :value="value" :client="client" v-if="type==='string'"></k-string>
    <k-hash :value="value" :client="client" v-else-if="type==='hash'" @command="command"></k-hash>
    <k-list :value="value" :client="client" v-else-if="type==='list'" @command="command"></k-list>
    <k-set :value="value" :client="client" v-else-if="type==='set'" @command="command"></k-set>
    <k-hash :value="value" :client="client" v-else-if="type==='zset'" @command="command"></k-hash>

    <el-row style="margin-top:15px;">
      <hr>控制台
    </el-row>
    <el-row>
      <!-- 控制台 -->
      <el-input
        placeholder="输入命令，回车执行"
        v-model="terminal.command"
        style="margin-top:15px;margin-bottom:15px;"
        @keyup.enter.native="command"
      ></el-input>
      <el-input
        type="textarea"
        v-model="terminal.result"
        disabled
        rows="15"
        style="color:black !important;"
      ></el-input>
    </el-row>
  </div>
</template>

<script>
import KString from "./string";
import KHash from "./hash";
import KList from "./list";
import KSet from "./set";

export default {
  components: { KString, KHash, KList, KSet },
  props: {
    value: {
      type: Object,
      required: false
    },
    client: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: "",
      ttl: "-1",
      name: "",
      terminal: {
        command: "",
        result: ""
      }
    };
  },
  mounted() {
    console.log("-0-----");
    console.log(this.value);

    if (!this.value) {
      //没有vlaue，默认显示服务器状态
      this.terminal.command = "info";
      this.command();
    }

    this.load(this.value);
  },
  methods: {
    command(command) {
      if (command && typeof command === "string" && command.trim() !== "") {
        this.terminal.command = command;
      }
      if (this.terminal.command.trim() !== "") {
        //解析参数
        let command = this.terminal.command.trim();
        let args = command.split(" ");
        if (args.length > 1) {
          command = args[0];
          args.splice(0, 1);
        } else {
          args = [];
        }

        this.client.sendCommand(command, args, (err, value) => {
          if (err) {
            if (err.code) {
              this.terminal.result = err.message;
              return;
            }
          }
          console.log(value);
          if (value instanceof Array) {
            let temp = "";
            value.forEach(value => {
              temp += value;
              temp += "\n";
            });
            this.terminal.result = temp;
          } else {
            this.terminal.result = value;
          }

          //防止对目前的key进行操作，再重载一次
          this.load(this.value);
        });
      }
    },
    set() {
      if (this.type === "string") {
        this.terminal.command =
          "set " + this.value.key + " " + this.value.value;
        this.command();
      }
    },
    load(nv) {
      if (nv) {
        this.client.type(nv.key, (err, v) => {
          this.value.type = v;
          this.type = v;
          console.log(`type = ${v}`);
        });

        this.client.ttl(nv.key, (err, value) => {
          //启动定时器
          this.ttl = parseInt(value);
          if (this.ttl > -1) {
            this.interval_index = setInterval(() => {
              this.ttl -= 1;
              if (this.ttl <= 0) {
                clearInterval(this.interval_index);
              }
            }, 1000);
          }
        });
      }
    }
  },
  watch: {
    value(nv) {
      //解析数据
      this.load(nv);
    }
  }
};
</script>
