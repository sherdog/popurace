const mongoose = require('mongoose')
const config = require('./config');
class Connection {
    static connect() {
        if ( this.db ) return Promise.resolve(this.db)
        return mongoose.connect(this.url, this.options)
    }
}
Connection.db = null
Connection.url = config.mongodb.host
Connection.options = {
    useNewUrlParser: true,
    sslValidate: false,
    ssl: false
}

module.exports = { Connection }