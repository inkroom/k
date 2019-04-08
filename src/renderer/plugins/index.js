// 插件位置
//引入插件
import Vue from 'vue';
import { resolve } from 'path';

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
    if (key === './index.js') return;

    let origin = files(key).default;
    console.log(origin);

    console.log(new origin());

    modules[key.replace(/(\.\/|\.js)/g, '')] = new origin();
})



let helpers = {

    getOriginNames() {
        let names = [];
        console.log(modules);

        for (const key in modules) {
            if (modules.hasOwnProperty(key)) {
                const element = modules[key];
                names.push({ name: element.originName, key: key })
            }
        }
        return names;
    },


    getMusic(music) {

        return Promise.resolve(modules[music.origin].getMusic(music).then(music => { music.id = Math.random(); return music; }))
        // return new Promise((resolve,reject)=>{
        //     modules[music.origin].getMusic(music).then()
        // })
        // return  modules[music.origin].getMusic(music);
    },

    getMusics(origin, url) {


        let m = modules[origin];
        console.log(m);
        console.log(origin);
        let res = m.getMusics(url).then(musics => {

            console.log('m - musics')
            console.log(musics);

            musics.forEach(e => {
                e.status = true; e.origin = origin; e.originName = m.originName
            })
            return musics;
        });
        console.log('then')
        console.log(res);
        return Promise.resolve(res);
        // return Promise.resolve(m.getMusics(url).then(musics => { musics.forEach(e => { e.status = true; e.origin = origin; e.originName = m.originName }) }))
        // return modules[origin].getMusics(url);
    }

}



export default helpers;