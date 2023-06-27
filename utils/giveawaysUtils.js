const Discord = require('discord.js')
const { GiveawaysManager } = require('discord-giveaways')

const giveawaysManager = (client, path) => {
	client.giveawaysManager = new GiveawaysManager(client, {
	    storage: path,
	    default: {
	        botsCanWin: false,
	        embedColor: client.config.embed.color,
	        reaction: "🎉",
	        lastChance: {
	            enabled: true,
	            content: '⚠️ **DERNIÈRE CHANCE DE PARTICIPER !** ⚠️',
	            threshold: 5000,
	            embedColor: client.config.embed.color
	        }
	    }
	})
}

const giveawaysMessages = {
    giveaway: "@everyone\n\n" + "🎉🎉 **GIVEAWAY** 🎉🎉",
    giveawayEnded: "@everyone\n\n" + "🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
    inviteToParticipate: "Réagissez avec 🎉 pour participer !",
    dropMessage: "Soyez le premier à réagir à 🎉 !",
    drawing: 'tirage : {timestamp}',
    winMessage: "Félicitations, {winners}! Vous avez gagné **{this.prize}**!",
    embedFooter: "Giveaways",
    noWinner: "Concours annulé, aucune participation valide.",
    hostedBy: "Organisé par: {this.hostedBy}",
    winners: "gagnant(s)",
    endedAt: "Terminé à"
}

module.exports = {
	giveawaysManager,
	giveawaysMessages
}