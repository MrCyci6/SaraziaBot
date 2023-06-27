const { SlashCommandBuilder } = require('@discordjs/builders')

const db = require('../../utils/DBUtils.js')
const stafflogs = require(`../../utils/stafflogs.js`)
const dmlogs = require(`../../utils/dmlogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription("Bannir un membre")
        .addUserOption(option => option.setName('membre').setDescription("Membre à bannir").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison du bannissement").setRequired(false)
        ),

    async execute(client, interaction, color) {
		
        let id = interaction.options.getUser("membre").id
        let guild = client.guilds.cache.get(client.config.server.id)
        let member = guild.members.cache.get(id)
        
        if(!member) return interaction.reply({content: "Membre déjà banni", ephemeral: true})
        if(member.id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(member.id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(member.id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {

            await dmlogs(client, author, member, "Bannissement", `${reason || `Aucune raison`}`)

            await interaction.guild.members.ban(member.id, { reason: `${reason || `Aucune raison`}` }).catch((error) => {})

            try {
                await db.query(`INSERT INTO banned (userid, username, staffid, staffusername, raison) VALUES ("${member.user.id}", "${member.user.username}#${member.user.discriminator}", "${author.user.id}", "${author.user.username}#${author.user.discriminator}", "${reason || "Aucune raison"}")`)
            } catch (e) {
                interaction.guild.channels.cache.get(client.config.channels.logs).send({content: `[DATABASE ERROR] - Une erreur est survenue lors de l'ajout d'un bannissement dans la base de donnée.\nRegarder la console pour en savoir plus.`})
                return console.log(`[DATABASE ERROR] - ${e}`)
            }

            await stafflogs(client, author, member, "Bannissement", `${reason || `Aucune raison`}`)

            await interaction.reply({content: `Tu viens de bannir ${member.user.username} (${member.user.id})\nPour: ${reason || `Aucune raison`}`, ephemeral: true})
            

        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}