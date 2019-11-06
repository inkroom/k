<style>
.el-input__inner {
  padding: 0;
}
.el-textarea.is-disabled .el-textarea__inner {
  background-color: white;
  color: black !important;
}
/* .el-scrollbar__thumb {
  background-color: black !important;
} */
.el-scrollbar__wrap {
  /* overflow-x: hidden !important; */
}
</style>


<template>
  <div style="height:100%;">
    <el-row v-if="redisKey">
      <el-col :md="2" :sm="2" :xs="2">
        <span>name：</span>
      </el-col>
      <el-col :md="13" :sm="11" :xs="6">
        <!-- <span>{{value.key}}</span> -->
        <div class="el-input el-input--mini" style="user-select:auto;">
          <span class="el-input__inner" style="user-select:auto;">{{redisKey}}</span>
        </div>
        <!-- <el-input v-model="redis" size="mini" disabled></el-input> -->
      </el-col>
      <el-col :md="9" :sm="11" :xs="16">
        <span>TTL: {{ ttl }}</span>

        <el-button size="mini" @click.native="rename">重命名</el-button>
        <el-button size="mini" @click.native="del">删除</el-button>
        <!-- <el-button size="mini" @click.native="set">修改</el-button> -->
      </el-col>
    </el-row>
    <k-string :redis="redisKey" :index="index" v-if="type==='string'"></k-string>
    <k-hash
      :redis="redisKey"
      :type="type"
      :client="client"
      v-else-if="type==='hash'"
      @command="command"
    ></k-hash>
    <k-list :redis="redisKey" :index="index" v-else-if="type==='list'" @command="command"></k-list>
    <k-set :redis="redisKey" :index="index" v-else-if="type==='set'" @command="command"></k-set>
    <k-hash
      :redis="redisKey"
      :type="type"
      :index="index"
      v-else-if="type==='zset'"
      @command="command"
    ></k-hash>

    <el-row style="margin-top:15px;">
      <hr />控制台
    </el-row>
    <el-row>
      <!-- 控制台 -->
      <el-input
        placeholder="输入命令，回车执行"
        v-model="terminal.command"
        style="margin-top:15px;margin-bottom:15px;"
        @keyup.enter.native="command"
      ></el-input>
      <el-scrollbar style="height:300px;">
        <div v-html="this.terminal.result" style="margin-bottom:30px;user-select:auto;"></div>
      </el-scrollbar>

      <!-- <el-input
        type="textarea"
        v-model="terminal.result"
        disabled
        rows="15"
        style="color:black !important;"
      ></el-input>-->
    </el-row>
  </div>
</template>

<script>
import KString from "./string";
import KHash from "./hash";
import KList from "./list";
import KSet from "./set";
import { isNumber } from "util";

export default {
  components: { KString, KHash, KList, KSet },
  props: {
    redisKey: {
      //对应键的key，如果是host就没有
      type: String,
      required: false
    },
    index: {
      // 标志redis 连接的索引
      type: String,
      required: true
    }
  },
  data() {
    return {
      type: "",
      ttl: "-1",
      name: "",
      value: null,
      terminal: {
        command: "",
        result: ""
      }
    };
  },
  mounted() {
    if (!this.key) {
      //没有vlaue，默认显示服务器状态
      this.terminal.command = "info";
      this.command();
    }

    this.load(this.key);
  },
  computed: {
    commandResult() {
      return this.htmlEscape(this.terminal.result);
    }
  },
  filters: {},
  methods: {
    htmlEscape(text) {
      return text.replace(/[<>"&]/g, function(match, pos, originalText) {
        switch (match) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          case '"':
            return "&quot;";
        }
      });
    },
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

        this.$redis
          .sendCommand(this.index, command, args)
          .then(value => {
            if (value instanceof Array) {
              let temp = "";
              value.forEach(v => {
                // console.log(`value = ${value}`)
                temp += this.htmlEscape(v).replace("\n", "<br/>");
                temp += "<br/>";
              });
              console.log(temp);
              this.terminal.result = temp;
            } else if (isNumber(value)) {
              this.terminal.result = value;
              console.log(value);
            } else {
              console.log(value);
              if (value == null) this.terminal.result = "";
              else
                this.terminal.result = this.htmlEscape(value).replace(
                  new RegExp("\\n", "g"),
                  "<br/>"
                );
            }
            console.log(this.terminal.result);
            //防止对目前的key进行操作，再重载一次
            this.load(this.redisKey);
          })
          .catch(err => {
            if (err) this.terminal.result = err.message;
          });
      }
    },
    rename() {
      this.$prompt("请输入新的key", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /.+/,
        inputErrorMessage: "key格式不正确"
      })
        .then(value => {
          this.terminal.command = "rename " + this.redisKey + " " + value;
          this.redisKey = value;
          this.command();
        })
        .catch(() => {});
    },
    del() {
      this.terminal.command = "del " + this.redisKey;
      this.command();
    },
    load(nv) {
      if (nv) {
        this.$redis
          .type(this.index, nv)
          .then(v => {
            this.type = v;
            //启动定时器
          })
          .catch(err => {
            this.$message("发生错误");
          });

        this.$redis
          .ttl(this.index, nv)
          .then(v => {
            //启动定时器
            this.ttl = parseInt(v);
            if (this.ttl > -1) {
              this.interval_index = setInterval(() => {
                this.ttl -= 1;
                if (this.ttl <= 0) {
                  clearInterval(this.interval_index);
                }
              }, 1000);
            }
          })
          .then(e => {});
      }
    }
  }
  // watch: {
  //   redis(nv) {
  //     //解析数据
  //     this.load(nv);
  //   }
  // }
};
</script>
