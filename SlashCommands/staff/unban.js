const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

const db = require('../../utils/DBUtils.js')
const stafflogs = require(`../../utils/stafflogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription("Débannir un membre")
        .addStringOption(option => option.setName('identifiant').setDescription("ID du membre à débannir").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison du débanissement").setRequired(false)
        ),

    async execute(client, interaction, color) {
        
        let id = interaction.options.getString("identifiant")
        let guild = client.guilds.cache.get(client.config.server.id)
        let member = guild.members.cache.get(id)
        
        if(member) return interaction.reply({content: "Membre non banni", ephemeral: true})
        if(id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {
            
            await interaction.guild.members.unban(id, { reason: `${reason || `Aucune raison`}` }).catch((error) => {})

            let embed = new Discord.EmbedBuilder()
                .setTitle(`Modération`)
                .setThumbnail(author.displayAvatarURL({dynamic: true}))
                .setColor(client.config.embed.color)
                .addFields(
                    {
                        name: `Staff`,
                        value: `${author} (${author.user.username}#${author.user.discriminator == 0 ? "0000" : author.user.discriminator})`
                    },
                    {
                        name: `Membre`,
                        value: `<@${id}> (${id})`
                    },
                    {
                        name: `Action`,
                        value: `UnBan`
                    },
                    {
                        name: `Raison`,
                        value: `${reason || `Aucune raison`}`
                    }
                )
                .setTimestamp()
                .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

            await interaction.guild.channels.cache.get(client.config.channels.logs).send({embeds: [embed]})
            
            await interaction.reply({content: `Tu viens de débannir <@${id}> (${id})\nPour: ${reason || `Aucune raison`}`, ephemeral: true})
                
            try {

                let conn = await db.db.getConnection()
                let res = await conn.query(`DELETE FROM banned WHERE userid = "${id}"`)
                conn.release()

                if(res.affectedRows == 0) {
                    interaction.reply({content: `Le membre avec l'identifiant **${id}** n'est pas présent dans la base de données **ou** n'est pas banni`})
                }
            
            } catch (e) {
                interaction.guild.channels.cache.get(client.config.channels.logs).send({content: `[DATABASE ERROR] - Une erreur est survenue lors de l'ajout d'un bannissement dans la base de donnée.\nRegarder la console pour en savoir plus.`})
                return console.log(`[DATABASE ERROR] - ${e}`)
            }
            

        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}