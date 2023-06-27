const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Latence du bot'),

	async execute(client, interaction, color) {
		interaction.reply({content: `Latence : ${client.ws.ping}ms`})
	}
}