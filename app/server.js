const app = require('./index')
const http = require('http').Server(app)
const { Connection } = require('./db')
const fs = require('fs')
const path = require('path')

//include some sort of logging.. need to research
console.log('Starting server instance')

let port = 3000;

//override port for dynamic seåtting by heroku
if (process.env.PORT) {
	port = process.env.PORT;
}
Connection.connect()
.then(con => {
    //load all of routers/controller/middleware what have you.
    console.log('Connected to mongo ' + con)
    app.set('db', con);

    //load models
	/*
	const modelsPath = path.resolve(__dirname, 'models')
    fs.readdirSync(modelsPath).forEach(file => {
        console.log('model: ' + modelsPath + '/' + file)
        require(modelsPath + '/' + file)
    })
	*/
    
    const server = http.listen(port, function() {
        console.log('Listening on port ' + port)
    });
    
})
.catch(error => {
    console.log('Error creating mongoose connection ', error)
})


