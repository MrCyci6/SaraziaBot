const express = require('express')
const passport = require('passport')
const session = require('express-session')
const fs = require('fs')

const config = require('./config.json')

const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(session({ secret: ';Cp6h454ZPCA@i.7~[qd', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

require('./utils/passportUtils.js')(passport);

fs.readdirSync("./routes").forEach(file => {
	
	if(!file.endsWith('.js')) return   
    
    app.use('/', require(`./routes/${file}`))     
    console.log(`>>> route : ${file}`)
})

const start = () => {
	
	try {

		let port = config.bot.port
		http.listen(port)
		
		console.log(`- API enabled on ${config.bot.callbackUrl}`)

	} catch (e) {
		console.log(`[API ERROR][START] - ${e}`)
	}
}

module.exports = start