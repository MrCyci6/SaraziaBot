const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const db = require('../../utils/DBUtils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invites')
		.setDescription('Informations sur les invitations')
		.addUserOption(option => option.setName('membre').setDescription("Voir les invitations d'un membre").setRequired(false)),

	async execute(client, interaction, color) {

		let member
		if(!interaction.options.getUser("membre")) {
			member = interaction.guild.members.cache.get(interaction.user.id)
		} else {
			member = interaction.guild.members.cache.get(interaction.options.getUser("membre").id)
		}

		try {
		    let conn = await db.db.getConnection()
		    let invitations = await conn.query(`SELECT number FROM invitations WHERE userid = "${member.user.id}"`)
		    conn.release()

		    let invite = 0
		    if(invitations != "") {
		    	invite = invitations[0].number
		    }

			const embed = new Discord.EmbedBuilder()
				.setTitle(`${member.user.username}#${member.user.discriminator == 0 ? "0000" : member.user.discriminator}`)
				.setColor(color)
				.setDescription(`Vous avez ${invite} invitations`)
		
			interaction.reply({embeds: [embed]})
		} catch (e) {
			console.log(`[DATABASE ERROR][INVITES] - ${e}`)
			interaction.reply({content: `Une erreur s'est produite lors de la connexion à la base de données.\nConsulter la console pour en savoir plus`})	
		}
	}
}