var express = require('express');
var redis;

if (process.env.REDISTOGO_URL) {
  module.exports.rtg = require('url').parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(module.exports.rtg.port, module.exports.rtg.hostname);
  redis.auth(module.exports.rtg.auth.split(':')[1]);  
} else {
  module.exports.rtg = {
    hostname: null,
    port: null,
    auth: ''
  };
  redis = require('redis').createClient(6379, 'localhost');
}

var RedisStore = require('connect-redis')(express);
module.exports.sessionStore = new RedisStore({client: redis});
