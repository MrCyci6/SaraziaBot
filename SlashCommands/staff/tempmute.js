const { SlashCommandBuilder } = require('@discordjs/builders')

const ms = require("ms")

const stafflogs = require(`../../utils/stafflogs.js`)
const dmlogs = require(`../../utils/dmlogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempmute')
        .setDescription("Rendre muet temporairement un membre")
        .addUserOption(option => option.setName('membre').setDescription("Membre à rendre muet").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison").setRequired(true))
        .addIntegerOption(option => option.setName('jours').setDescription('Le nombre de jours à mute').setRequired(true))
        .addIntegerOption(option => option.setName('heures').setDescription("Le nombre d'heures à mute").setRequired(true))
        .addIntegerOption(option => option.setName('minutes').setDescription('Le nombre de minutes à mute').setRequired(true)),

    async execute(client, interaction, color) {

        let member = interaction.guild.members.cache.get(interaction.options.getUser('membre').id)
        
        if(member.user.id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(member.user.id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(member.id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)
        let d = interaction.options.getInteger("jours")
        let h = interaction.options.getInteger("heures")
        let m = interaction.options.getInteger("minutes")

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {

            member.timeout(ms(d + "d") + ms(h + "h") + ms(m + "m"), `${reason || `Aucune raison`}`)
            
            stafflogs(client, author, member, "TempMute", `${reason || `Aucune raison`}`)

            interaction.reply({content: `Vous avez rendu muet ${member.user.username} (${member.user.id})\nPour: \`${reason || `Aucune raison`}\`\nIl retrouvera la parole <t:${tempsRestant()}:R>`, ephemeral: true})

            dmlogs(client, author, member, "Mute", `${reason}`)
        
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
            
        function tempsRestant() {
            day = d * 86400
            heure = h * 600
            minutes = m * 60

            return Math.round(+new Date() / 1000) + day + heure + minutes
        }
    }
}