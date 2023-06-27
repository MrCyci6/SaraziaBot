const Discord = require('discord.js')
const client = new Discord.Client({intents: [3276799]})

const { readdirSync } = require('fs')

const api = require('./api.js')
const giveawayUtils = require('./utils/giveawaysUtils.js')

// CONFIG
client.config = require("./config.json")
client.commands = new Discord.Collection()
client.command = []
client.invites = new Discord.Collection()
client.whitelisted_channel = []
client.whitelisted_member = []
client.whitelisted_words = ['.gg/sarazia']

// ERREUR
process.on("unhandledRejection", err => {
   	if(err.message) return
  	console.error("Uncaught Promise Error: ", err);
})

// GIVEAWAYS
giveawayUtils.giveawaysManager(client, "./giveaways.json")

// EVENTS & COMMANDS HANDLER
const loadSlashCommands = (dir = "./SlashCommands") => {
    readdirSync(dir).forEach(dirs => {
    	const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
  
      	for (const file of commands) {
	        const getFileName = require(`${dir}/${dirs}/${file}`)
	        client.commands.set(getFileName.data.name, getFileName);
	    	client.command.push(getFileName.data.toJSON())
	     	console.log(`>>> commande : ${getFileName.data.name} [${dirs}]`)
  		}
    })
}

const loadEvents = (dir = "./Events") => {
    readdirSync(dir).forEach(dirs => {
	    const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
	  
	    for (const event of events) {
	        const evt = require(`${dir}/${dirs}/${event}`);
	        const evtName = event.split(".")[0];
	        client.on(evtName, evt.bind(null, client));
	        console.log(`>>> event : ${evtName} [${dirs}]`)
      	}
    })
}
loadEvents()
loadSlashCommands()

// LOGIN
client.login(client.config.bot.token)

// API
setTimeout(() => {
	api()
}, 2000)

exports.client = client