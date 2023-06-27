const Discord = require('discord.js')
const fs = require('fs')

const ticketLog = async (client, openUser, closeUser, openDate, closeDate, ticketName, userId, ticketId) => {

	const embed = new Discord.EmbedBuilder()
		.setTitle("Ticket logs")
    	.setURL('https://tickets.sarazia.eu/tickets')
    	.setDescription('Retrouvez la retranscription des tickets:\nhttps://tickets.sarazia.eu/tickets')
		.setColor(client.config.embed.color)
		.setThumbnail(openUser.displayAvatarURL({dynamic: true}))
		.addFields(
			{
				name: `Ouvert par`,
				value: `${openUser} (${openUser.user.username}#${openUser.user.discriminator == 0 ? "0000" : openUser.user.discriminator})`
			},
			{
				name: `Fermé par`,
				value: `${closeUser} (${closeUser.user.username}#${closeUser.user.discriminator == 0 ? "0000" : closeUser.user.discriminator})`
			},
			{
				name: `Date d'ouverture`,
				value: `${openDate}`
			},
			{
				name: `Date de fermeture`,
				value: `${closeDate}`
			}
		)

	let logs = openUser.guild.channels.cache.get(client.config.channels.logs)
	if(!logs) return
	let logMessage = await logs.send({embeds: [embed]})
	try {
		openUser.send({embeds: [embed]})
	} catch (e) {
		console.log(`[BOT ERROR][TICKET] - L'utilisateur ${openUser.user.username} n'autorise probablement pas les messages privés`)
	}

	if(fs.existsSync(`./tickets/${userId}_${ticketName}.html`)) {
		let thread = await logMessage.startThread({ name: `Retrouvez la transcription`})
		
		await thread.send({files: [`./tickets/${userId}_${ticketName}.html`]})

		await fs.rename(`./tickets/${userId}_${ticketName}.html`, `./tickets/${userId}_${ticketName}_${ticketId}.html`, err => {
			if(err) return console.log(`[DISCORD ERROR][TICKET] - ${e}`)
		})

	}

	return
}

module.exports = ticketLog