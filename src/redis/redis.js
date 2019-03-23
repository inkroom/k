const redis = require('redis');

let client = redis.createClient(6379, '127.0.0.1');

client.keys('*', function (err, reply) {
    if (err) throw err;
    reply.forEach(element => {
        console.log(element);
    });
})




module.exports = {
    keys(host, port, cb) {
        
        
        redis.createClient(port, host).keys('*', cb);
    },
    type(host, port, key, cb) {
        redis.createClient(port, host).type(key,cb)
    },
    ttl(host, port, key, cb) {
        redis.createClient(port, host).ttl(key, cb);
    },
    get(host, port, key, cb) {
        redis.createClient(port, host).get(key, cb);
    },
    set(host, port, key,value, cb) {
        redis.createClient(port, host).set(key,value,cb);
        redis.createClient().multi('get 123').exec()
    },
    exec(host, port, command,args, cb){


        // redis.createClient(port, host).zrange(key,0,-1, .sendCommand(command,args,cb);
    },
    redis:redis,

}