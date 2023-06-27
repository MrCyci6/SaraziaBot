const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

const db = require('../../utils/DBUtils.js')
const stafflogs = require(`../../utils/stafflogs.js`)
const dmlogs = require(`../../utils/dmlogs.js`)

const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription("Mettre un avertissement à un membre")
        .addUserOption(option => option.setName('membre').setDescription("Membre à sanctionner").setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription("Raison de la sanction").setRequired(false)),

    async execute(client, interaction, color) {

        if(!interaction.options.getUser("membre")) return interaction.reply({content: `Membre inexistant`, ephemeral: true})
        let member = interaction.guild.members.cache.get(interaction.options.getUser('membre').id)

        if(member.id === client.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(member.id === interaction.user.id) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})
        if(client.config.owners.includes(member.id)) return interaction.reply({content: 'Tu ne peux pas faire ça', ephemeral: true})

        let reason = interaction.options.getString('raison')
        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {
            
            if(reason) {
                try {

                    await db.query(`INSERT INTO warn (reason, user_id, user_name, staff_id, staff_name) VALUES ("${reason}", "${member.user.id}", "${member.user.username}#${member.user.discriminator}", "${author.user.id}", "${author.user.username}#${author.user.discriminator}")`)

                    stafflogs(client, author, member, "Avertissement", `${reason}`)                  

                    interaction.reply({content: `Tu viens de mettre un avertissement à **${member.user.username}#${member.user.discriminator}** pour **${reason}**`})

                    dmlogs(client, author, member, "Avertissement", `${reason}`)

                } catch (e) {
                    interaction.guild.channels.cache.get(client.config.channels.logs).send({content: `[DATABASE ERROR] - Une erreur est survenue lors de l'ajout d'un avertissement dans la base de donnée.\nRegarder la console pour en savoir plus.`})
                    return console.log(`[DATABASE ERROR] - ${e}`)
                }
            } else {

                let conn = await db.db.getConnection()
                let res = await conn.query('SELECT * FROM warn WHERE user_id = "' + member.user.id + '"')
                conn.release()

                if(res == "") return interaction.reply({content: `Cet utilisateur n'a aucun avertissement`})

                let list = []

                res.forEach(l => {
                    list.push(`**#${l.id}** • **${l.staff_name}** (**${l.staff_id}**) → \`${l.reason}\` (${moment(l.date).format('DD/MM/YYYY')})`)
                })

                const embed = new Discord.EmbedBuilder()
                    .setTitle("Avertissements de " + member.user.username + "#" + member.user.discriminator + " (" + member.user.id + ")")
                    .setColor(color)
                    .setDescription(list.join("\n"))
                
                interaction.reply({embeds: [embed]})

            }
  
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}