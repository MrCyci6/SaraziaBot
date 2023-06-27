const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

const stafflogs = require(`../../utils/stafflogs.js`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roleadd')
		.setDescription('Ajouter un role à un utilisateur')
        .addUserOption(option => option.setName('membre').setDescription("Membre").setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription("Role").setRequired(true)),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {
			
			let member = interaction.guild.members.cache.get(interaction.options.getUser('membre').id)
			let role = interaction.options.getRole('role')
			let author = interaction.guild.members.cache.get(interaction.user.id)

			if(!member) return
			if(!role) return

			if(author.roles.highest.rawPosition > role.rawPosition || member.roles.highest.rawPosition < author.roles.highest.rawPosition) {

				if(member.roles.cache.has(role.id)) {
					interaction.reply({content: `${member} possède déjà ce rôle`, ephemeral: true})
				} else {
					member.roles.add(role)

					await stafflogs(client, author, member, "Ajout de role", `${role}`)

					interaction.reply({content: `Le rôle ${role} vient d'être ajouté à ${member}`, ephemeral: true})
				}

			} else {
				interaction.reply({content: client.config.messages.noperm, ephemeral: true})
			}

	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}