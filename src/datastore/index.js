import DataStore from 'lowdb'
import fs from 'fs-extra';
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path';
import {
    remote,
    app
} from 'electron'

if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
    global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
}

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH)
    }
}

console.log(`文件路径=${path.join(STORE_PATH, '/data.json')}`);
const adapter = new FileSync(path.join(STORE_PATH, '/k_redis.json'))

const db = DataStore(adapter, {
    autosave: true
})


//初始化数据
if (!db.has('hosts').value()) {
    db.set('hosts', []).write()
}

//系统配置
if(!db.has('setting').value()){
    db.set('setting',{exitNotConfirm:false}).write();
}
export default db
// module.exports = {db:db};
//   export default db;