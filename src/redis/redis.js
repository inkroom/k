const redis = require('redis');
const bluebird = require('bluebird');

//promise化
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = {

    redis: redis,

}