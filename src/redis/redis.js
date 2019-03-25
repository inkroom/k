const redis = require('redis');
const bluebird = require('bluebird');
let client = redis.createClient(6379, '127.0.0.1');

client.keys('*', function (err, reply) {
    if (err) throw err;
    reply.forEach(element => {
        console.log(element);
    });
})
//promise化
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = {

    redis: redis,

}