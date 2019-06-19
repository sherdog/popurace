var config = module.exports
var PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
    port: process.env.EXPRESS_PORT || 3000,
    ip: '127.0.0.1'
}

config.mongodb = {
    port: process.env.MONGODB_PORT || 27017,
    host: process.env.MONGODB_HOST || 'mongodb://mongoadmin:michael5@138.197.122.119:27017,138.197.122.119:27017/community'
}

if (PRODUCTION)
{
    //set to the prod IP when that time comes.
    config.express.ip = '0.0.0.0'
}

config.email = {
    default_from: 'admin@localhost'
}