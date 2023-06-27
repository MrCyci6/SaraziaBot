const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('site')
		.setDescription('Informations du site web'),

	async execute(client, interaction, color) {
		
		const embed = new Discord.EmbedBuilder()
			.setTitle(`SITE » ${client.config.server.name}`)
			.setColor(color)
			.setDescription(`Voici le site web de ${client.config.server.name}\n\n**Web** » https://www.sarazia.fr/\n**Vote** » https://www.sarazia.fr/vote\n**Boutique** » https://www.sarazia.fr/shop`)

		interaction.reply({embeds: [embed], ephemeral: true})
	}
}