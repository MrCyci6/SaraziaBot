const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notif')
		.setDescription('Panel de notification'),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {
			const embed = new Discord.EmbedBuilder()
				.setTitle(`Panel des notifications`)
				.setColor(color)
				.setDescription(`Salut à toi !\nSi tu souhaites être averti des différentes notifications du serveur, je t'invite à réagir sur les boutons ci-dessous`)
				.setThumbnail(client.user.displayAvatarURL())


	        const bts = new Discord.ActionRowBuilder()
	        	.addComponents(
	            	new Discord.ButtonBuilder()
	                	.setCustomId('event')
	                    .setLabel("Evénements")
	                    .setStyle("Secondary")
	                    .setDisabled(false),
	                )
	            .addComponents(
	                new Discord.ButtonBuilder()
	                    .setCustomId('sondage')
	                    .setLabel("Sondages")
	                    .setStyle("Secondary")
	                    .setDisabled(false),
	                )
	            .addComponents(
	                new Discord.ButtonBuilder()
	                    .setCustomId('changelog')
	                    .setLabel("Change-Logs")
	                    .setStyle("Secondary")
	                    .setDisabled(false),
	                )

	        interaction.reply({embeds: [embed], components: [bts]})
	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}