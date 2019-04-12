import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH)
    }
}

const adapter = new FileSync(path.join(STORE_PATH, '/k-music.json'))

const db = Datastore(adapter)
db._.mixin(LodashId)

db._.mixin({
    // insert: function (collection, doc) {

    //     console.log('insert')
    //     console.log(collection)
    //     console.log(doc);
    //     return doc
    // },
    // updateWhere: function (collection, predicate, attrs) {
    //     var self = this
    //     var docs = this.filter(collection, predicate)

    //     docs.forEach(function (doc) {
    //         self.assign(doc, attrs, { id: doc.id })
    //     })

    //     return docs
    // },
    get: function (collection) {
        console.log(collection.musics);
        collection.musics.forEach(element => {
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    const value = element[key];
                    if (typeof value == 'string') {
                        element[key] = value.replace(/[<>"&]/g, function (match, pos, originalText) {
                            switch (match) {
                                case "<": return "&lt;";
                                case ">": return "&gt;";
                                case "&": return "&amp;";
                                case "\"": return "&quot;";
                            }
                        });
                    }
                }
            }

        });
        return collection;
    }
})

// if (!db.has('uploaded').value()) {
//   db.set('uploaded', []).write()
// }

// if (!db.has('picBed').value()) {
//   db.set('picBed', {
//     current: 'weibo'
//   }).write()
// }

// if (!db.has('shortKey').value()) {
//   db.set('shortKey', {
//     upload: 'CommandOrControl+Shift+P'
//   }).write()
// }

if (!db.has('musics').value()) {
    db.set('musics', []).write();
}

export default db