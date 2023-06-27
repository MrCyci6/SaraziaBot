const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Informations concernants le serveur'),

	async execute(client, interaction, color) {

		const embed = new Discord.EmbedBuilder()
			.setColor(color)
			.setTitle("**Informations du serveur**")
			.addFields(
				{
					name: "__**🌐 Général**__",
					value: `**• Nom**: ${interaction.guild.name}
**• ID**: ${interaction.guild.id}
**• Créateur**: <@${interaction.guild.ownerId}>
**• Niveau boost**: ${interaction.guild.premiumTier}
**• Région**: ${interaction.guild.preferredLocale || `Aucune`}
**• Niveau de sécurité**: ${interaction.guild.verificationLevel}`,
					inline: false
				},
				{
					name: "**__📊 Statistiques__**",
					value: `**• Rôles**: ${interaction.guild.roles.cache.size}
**• Emojis**: ${interaction.guild.emojis.cache.size}
**• Membres**: ${interaction.guild.memberCount}
**• Humains**: ${interaction.guild.members.cache.filter(member => !member.user.bot).size}
**• Bots**: ${interaction.guild.members.cache.filter(member => member.user.bot).size}
**• Channels**: ${interaction.guild.channels.cache.size}`,
					inline: true
				},
				{
					name: "**__❔ Présence__**",
					value: `**• En ligne**: ${interaction.guild.members.cache.filter(m => m.presence?.status === "online").size}
**• Absent**: ${interaction.guild.members.cache.filter(m => m.presence?.status === "idle").size}
**• Ne pas déranger**: ${interaction.guild.members.cache.filter(m => m.presence?.status === "dnd").size}
**• Hors ligne**: ${interaction.guild.members.cache.filter(m => m.presence?.status === "offline").size}`,
					inline: true
				})
			.setFooter({text: `© 2022 - ${client.config.server.name} » Informations`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))

		interaction.reply({embeds: [embed]})
	}
}