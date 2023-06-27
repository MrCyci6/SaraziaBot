const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription('Informations de connexion au serveur'),

	async execute(client, interaction, color) {
		
		const embed = new Discord.EmbedBuilder()
			.setTitle(`IP » ${client.config.server.name}`)
			.setColor(color)
			.setDescription(`Voici les informations de connexion de ${client.config.server.name}\n\n**Version** » 1.8.X - 1.19.X\n**IP** » play.sarazia.fr`)

		interaction.reply({embeds: [embed], ephemeral: true})
	}
}