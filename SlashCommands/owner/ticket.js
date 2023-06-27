const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Panel des tickets'),

	async execute(client, interaction, color) {
		if(client.config.owners.includes(interaction.user.id)) {

	       let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('create')
                        .setLabel("Créer un ticket")
                        .setStyle("Primary")
                )
                     
			const embed = new Discord.EmbedBuilder()
				.setTitle(`🎟️ ${client.config.server.name} » Support`)
				.setColor(color)
				.setFooter({text: `© 2022 - ${client.config.server.name} » Tickets`, iconURL: client.user.displayAvatarURL({dynamic: true})})
				.setDescription(`Créez un ticket support en **cliquant** sur le boutton ci-dessous, et en **remplissant** le formulaire.\n\nL'équipe de **${client.config.server.name}** se fera un **plaisir** de vous répondre !`)
				.setThumbnail(client.user.displayAvatarURL())

	        interaction.reply({embeds: [embed], components: [row]})
	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}