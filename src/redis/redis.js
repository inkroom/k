const redis = require('redis');
const bluebird = require('bluebird');

//promise化
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


//存储redis连接

let pool = {

};




export default {

    init(host, port, password = '', index = 0) {
        let options = {
            port,
            host,
            retry_strategy: value => {
                if (value.code === "ECONNREFUSED") {
                    //此时不重试
                }
                //FIXME: 无法触发error事件
                return new Error(`${value.address}无法连接`);
            }
        };
        if (password !== "") {
            options.password = password;
        }
        options.db = index;

        console.log('init redis client')

        return new Promise((resolve, reject) => {
            pool[host + '-' + port] = redis.createClient(options)
                .on("error", err => {
                    console.error('创建redis client 失败')
                    reject(err);
                   
                })
                .on("ready", () => {
                    console.log('创建redis client')
                    resolve(host + '-' + port, pool[host + '-' + port]);
                })
                .on("end", () => {
                    delete pool[host + '-' + port];
                })
        })



    },
    keysAsync(index, regex) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return pool[index].keysAsync(regex);

    },
    sendCommand(index, command, args) {
        
        console.log(`index=${index} command =${command} `)
        if (!pool[index]) {
            console.log('没有')
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            pool[index].sendCommand(command, args, (err, value) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(value);
            })
        })


    },
    type(index, redisKey) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].type(redisKey, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {

                    resolve(v)

                }


            });
        });
    },
    ttl(index, key) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            console.log('ttl')
            pool[index].ttl(key, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    console.log(v);
                    resolve(v)
                }
            });
        });


    },
    hgetall(index, key) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].hgetall(key, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(v)
                }
            });
        });
    },
    zrange(index, key, args0, args1, unit) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].zrange(key, args0, args1, unit, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(v)
                }
            });
        });
    },
    lrange(index, key, args0, args1) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].lrange(key, args0, args1, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(v)
                }
            });
        });
    },
    sunion(index, key) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].sunion(key, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(v)
                }
            });
        });
    },
    get(index, key) {
        if (!pool[index]) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            pool[index].get(key, (err, v) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(v)
                }
            });
        });
    }
}