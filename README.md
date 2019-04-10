![k](https://github.com/inkroom/k/blob/master/static/img/k.png?raw=true)

[![platform](https://woolson.gitee.io/npmer-badge/platform-555555-linux-44cc11-download-ffffff-square-gradient-shadow.svg)](https://github.com/inkroom/k/releases)

![GitHub Releases](https://img.shields.io/github/downloads/inkroom/k/v0.3.2/total.svg?label=download&style=popout)

基于electron的redis客户端，可以在linux、macOs、win下运行



![k-redis-gui](https://user-images.githubusercontent.com/27911304/55671695-3905e500-58c5-11e9-8411-34f2c182d028.png)

![k-redis-gui](https://user-images.githubusercontent.com/27911304/55671711-6357a280-58c5-11e9-97d6-b1351bdec700.png)


## features

- [x] redis订阅发布
- [x] 提供命令行工具
- [x] [黑色主题，来自Arattian/element-theme-dark](https://github.com/Arattian/element-theme-dark)
- [ ] 实现自定义主题方案功能
- [x] 背景图片自动切换（点击logo即可设置背景图片）

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

```

## bug
- \x00等特殊字符无法正常显示
- ~~命令结果过宽，没有横向滚动条~~
- ~~生产模式添加host依然会一次添加两个~~
- ~~host reflash无用~~
- ~~优化string类型内容展示div，文本出现红色边框~~
- ~~host点击刷新后，所有key都出现下拉icon~~
- ~~部分情况下，删除host，会出现无限递归~~
- 偶尔删除host会报循环引用不能json的错

## download

下载地址：[https://github.com/inkroom/k/releases](https://github.com/inkroom/k/releases)

ps:**因本人基本只使用linux系统，因此只提供AppImage格式，其余格式请clone后自行打包** 


ps: deb格式图标老是不出来，目前尚未解决


## Licence

MIT


