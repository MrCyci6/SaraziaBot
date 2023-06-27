const Discord = require('discord.js')

const dmlogs = async (client, staff, utilisateur, cmd, raison) => {

	let embed = new Discord.EmbedBuilder()
		.setTitle(`SANCTION`)
		.setColor(client.config.embed.color)
		.setDescription('Tu viens de **recevoir** une sanction !')
		.addFields(
			{
				name: `Staff`,
				value: `${staff} (${staff.user.username}#${staff.user.discriminator == 0 ? "0000" : staff.user.discriminator})`
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
		.setFooter({ text: `© 2022 - Sarazia`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

	return utilisateur.send({embeds: [embed]})

}

module.exports = dmlogs;