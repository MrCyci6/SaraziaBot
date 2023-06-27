const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Photo de profil')
		.addUserOption(option => option.setName('membre').setDescription("membre").setRequired(false)),

	async execute(client, interaction, color) {

		let member
		if(!interaction.options.getUser("membre")) {
			member = interaction.guild.members.cache.get(interaction.user.id)
		} else {
			member = interaction.guild.members.cache.get(interaction.options.getUser("membre").id)
		}
		
		const embed = new Discord.EmbedBuilder()
			.setTitle(member.user.tag)
			.setColor(color)
			.setImage(member.user.displayAvatarURL({dynamic: true}))

		interaction.reply({embeds: [embed]})
	}
}