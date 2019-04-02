# k

基于electron的redis客户端，可以在linux、macOs、win下运行




![k-redis-gui](https://user-images.githubusercontent.com/27911304/55054165-bf3a5400-5099-11e9-8cb2-53be0cc5e72c.png)

![深度截图_k_20190327141348](https://user-images.githubusercontent.com/27911304/55054380-99617f00-509a-11e9-9ad4-38d920d975e9.png)


## features

- [x] redis订阅发布
- [x] 提供命令行工具
- [x] [黑色主题](https://github.com/Arattian/element-theme-dark)
- [ ] 实现自定义主题方案功能
- [x] 背景图片自动切换（点击logo(栉名安娜)即可设置背景图片）

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
- 命令结果过宽，没有横向滚动条
- ~~生产模式添加host依然会一次添加两个~~
- host reflash无用
- 优化string类型内容展示div，文本出现红色边框
- host点击刷新后，所有key都出现下拉icon
- 部分情况下，删除host，会出现无限递归

## download

下载地址：[https://github.com/inkroom/k/releases](https://github.com/inkroom/k/releases)

ps:**因本人基本只使用linux系统，因此只提供AppImage格式，其余格式请clone后自行打包**
ps: deb格式图标老是不出来，目前尚未解决


## Licence

MIT


