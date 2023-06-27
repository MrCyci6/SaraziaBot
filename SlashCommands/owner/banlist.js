const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const db = require('../../utils/DBUtils.js')
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription("Afficher tous les bannissements du serveur"),

    async execute(client, interaction, color) {

        let author = interaction.guild.members.cache.get(interaction.user.id)

        if(client.config.owners.includes(interaction.user.id)) {
            
            try {
                let conn = await db.db.getConnection()
                let bans = await conn.query('SELECT * FROM banned')
                conn.release()
                
                if(bans == "") return interaction.reply({content: `Aucun bannissement sur le serveur`})

                let p0 = 0
                let p1 = 10
                let list = []

                await bans.forEach(ban => {
                    list.push(`**#${ban.id}** • **${ban.username}** (**${ban.userid}**) → \`${ban.raison}\` (${moment(ban.date).format('DD/MM/YYYY')})`)
                })

                const embed = new Discord.EmbedBuilder()
                    .setTitle('⚠ • Voici la liste des bannisssements du serveur')
                    .setColor(color)
                    .setDescription(list.slice(p0, p1).join("\n"))
                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${bans.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})

                await interaction.reply({embeds: [embed]})

                if(list.length > 10) {
                    const embed = new Discord.EmbedBuilder()
                        .setTitle('⚠ • Voici la liste des bannisssements du serveur')
                        .setColor(color)
                        .setDescription(list.slice(p0, p1).join("\n"))
                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${bans.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                    
                    const bts = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('banleft')
                                .setEmoji("◀️")
                                .setStyle("Primary")
                                .setDisabled(false),
                            )
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('banright')
                                .setEmoji("▶️")
                                .setStyle("Primary")
                                .setDisabled(false),
                            )
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('banreset')
                                .setEmoji("↩️")
                                .setStyle("Danger")
                                .setDisabled(false)
                            )

                    interaction.editReply({components: [bts]})

                    setTimeout(() => {
                        interaction.editReply({components: []})
                    }, 60000 * 5)

                    client.on("interactionCreate", inte => {
                        if(inte.isButton()) {
                            if(inte.user.id == author.user.id) {

                                if(inte.customId == "banleft") {
                                    if((p0 - 10) <= 0 || p0 <= 0 || p0 == undefined || p1 == undefined) {
                                        p0 = 0
                                        p1 = 10
                                    } else {
                                        p0 = p0 - 10
                                        p1 = p1 - 10
                                    }

                                    const embed = new Discord.EmbedBuilder()
                                        .setTitle('⚠ • Voici la liste des bannisssements du serveur')
                                        .setColor(color)
                                        .setDescription(list.slice(p0, p1).join("\n"))
                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${bans.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                                    
                                    interaction.editReply({embeds: [embed]})
                                    inte.deferUpdate()

                                }


                                if(inte.customId == "banright") {
                                    if((p1 + 10) > list.length || p1 >= list.length || p0 == undefined || p1 == undefined) {
                                        p0 = list.length - 10
                                        p1 = list.length
                                    } else {
                                        p0 = p0 + 10
                                        p1 = p1 + 10
                                    }

                                    const embed = new Discord.EmbedBuilder()
                                        .setTitle('⚠ • Voici la liste des bannisssements du serveur')
                                        .setColor(color)
                                        .setDescription(list.slice(p0, p1).join("\n"))
                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${bans.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                                    
                                    interaction.editReply({embeds: [embed]})
                                    inte.deferUpdate()
                                    
                                }

                                if(inte.customId == "banreset") {
                                    p0 = 0
                                    p1 = 10

                                    const embed = new Discord.EmbedBuilder()
                                        .setTitle('⚠ • Voici la liste des bannisssements du serveur')
                                        .setColor(color)
                                        .setDescription(list.slice(p0, p1).join("\n"))
                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${bans.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                                    
                                    interaction.editReply({embeds: [embed]})
                                    inte.deferUpdate()
                                }

                            } else {
                                inte.deferUpdate()
                            }
                        }
                    })
                }
            } catch (e) {
                interaction.reply({content: `[DATABASE ERROR] - Une erreur est survenue lors de la connexion à la base de données.\nRegarder la console pour en savoir plus.`})
                console.log(`[DATABASE ERROR] - ${e}`)
            }
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }

    }
}