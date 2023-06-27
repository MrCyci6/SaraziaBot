const { SlashCommandBuilder } = require('@discordjs/builders')

const stafflogs = require(`../../utils/stafflogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Rendre la parole à un membre")
        .addUserOption(option => option.setName('membre').setDescription("Membre à rendre la parole").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison").setRequired(true)),

    async execute(client, interaction, color) {

        let member = interaction.guild.members.cache.get(interaction.options.getUser('membre').id)

        if(member.id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(member.id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(member.id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {
            
            member.timeout(1)
            
            stafflogs(client, author, member, "UnMute", `${reason || `Aucune raison`}`)

            interaction.reply({content: `Vous avez rendu la parole à ${member.user.username} (${member.user.id})\nPour: \`${reason || `Aucune raison`}\``, ephemeral: true})

        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}