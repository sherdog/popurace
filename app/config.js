var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

if (process.env.NODE_ENV === "production")
    config.environment = process.env.NODE_ENV;
else
    config.environment = 'development'; 

config.express = {
    port: process.env.EXPRESS_PORT || 3000,
    ip: '127.0.0.1'
}

config.mongodb = {
    port: process.env.MONGODB_PORT || 27017,
    host: process.env.MONGODB_HOST || 'mongodb://sherdog:michael5@209.124.64.183:27017/community'
}

config.session = {
    hash: "mb4_+3@c%3LQ=QYPkXwBX#vbh#H32NHv-CbpXvRjhx6*$@AJZx-f%EmsRkhZjsH6"   
}

if (PRODUCTION)
{
    config.express.ip = '0.0.0.0'
}

config.email = {
    default_from: 'admin@localhost'
}
