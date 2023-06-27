const { SlashCommandBuilder } = require('@discordjs/builders')

const stafflogs = require(`../../utils/stafflogs.js`)
const dmlogs = require(`../../utils/dmlogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("Expulser un membre")
        .addUserOption(option => option.setName('membre').setDescription("Membre à expulser").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison de l'expulsion").setRequired(false)
        ),

    async execute(client, interaction, color) {

        let member = interaction.guild.members.cache.get(interaction.options.getUser('membre').id)

        if(member.id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(member.id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(member.id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {
            
            await dmlogs(client, author, member, "Expulsion", `${reason}`)
            
            await interaction.guild.members.kick(member.id, { reason: `${reason || `Aucune raison`}` }).catch((error) => { })
            
            await stafflogs(client, author, member, "Expulsion", `${reason || `Aucune raison`}`)
            
            await interaction.reply({content: `Tu viens d'expulser ${member.user.username} (${member.user.id})`, ephemeral: true})
  
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}