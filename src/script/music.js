

class Music {
    constructor(options) {
        //以下为必需
        this.url = options.url;
        this.cover = options.cover;
        this.name = options.name;
        this.time = options.time;

        this.origin = options.origin;
        this.originName = options.originName;

        //以下为容器维护字段
        this.status = true;
        this.id = 0;
        //其余非必须数据，插件使用

        this.custom = Object.assign({}, options);
    }
}

//音乐获取数据工具类
class Helper {
    constructor() {
        this.origin = 'ku';
        this.originName = '酷狗';
    }
    getMusic(music) {
        return Promise.reject();
    }
    getMusics(url) { return Promise.reject() };
}

export { Music, Helper };