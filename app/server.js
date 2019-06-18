var app = require('./index')
var config = require('./config')

//include some sort of logging.. need to research
console.log('staring server')

app.listen(config.express.port, config.express.ip, function(error){
    if (error)
    {
        //log the error with whatever.
        console.log('Errro ' + error);
        process.exit(10);
    }

    console.log('Express is listenig on http://' + 
        config.express.ip + ':' + config.express.port)

})