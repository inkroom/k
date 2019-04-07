interface Music {
    //以下为插件必须返回的数据字段
    /**
     * 音频url
     */
    url: String;
    /**
     * 封面url
     */
    cover: String;
    /**
         * 歌曲名
         */
    name: String;/**
    * 歌手
    */
    author: String;/**
   * 播放时长，单位秒
   */
    time: Number;

    //以下为容器维护数据，
    origin: String;
    originName: String;
    status: Boolean;
    id: Number;
}

interface Helper {

    /**
     * 获取音乐数据，如播放地址，类似酷狗每隔一段时间就会更换播放url，因此需要重新获取
     * @param music 
     */
    getMusic(music: Music): Promise<Music>;
    /**
     * 根据分享url导入歌单
     * @param url 导入音乐的地址
     */
    getMusics(url: string): Promise<Array<Music>>;


    /**
     * 搜歌
     * @param name 要搜索的歌曲名
     */
    search(name: string): Promise<Array<Music>>;
}