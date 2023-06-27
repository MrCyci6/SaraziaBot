const Discord = require('discord.js')

const stafflogs = async (client, staff, utilisateur, cmd, raison) => {

	let embed = new Discord.EmbedBuilder()
		.setTitle(`Modération`)
		.setThumbnail(utilisateur.displayAvatarURL({dynamic: true}))
		.setColor(client.config.embed.color)
		.addFields(
			{
				name: `Staff`,
				value: `${staff} (${staff.user.username}#${staff.user.discriminator == 0 ? "0000" : staff.user.discriminator})`
			},
			{
				name: `Membre`,
				value: `${utilisateur} (${utilisateur.user.username}#${utilisateur.user.discriminator == 0 ? "0000" : utilisateur.user.discriminator})`
			},
			{
				name: `Action`,
				value: `${cmd}`
			},
			{
				name: `Raison`,
				value: `${raison}`
			}
		)
		.setTimestamp()
		.setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

	let log = staff.guild.channels.cache.get(client.config.channels.logs)
	if(!log) return
	return log.send({embeds: [embed]})

}

module.exports = stafflogs;