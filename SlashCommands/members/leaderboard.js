const { SlashCommandBuilder } = require('@discordjs/builders')

const Discord = require('discord.js')

const db = require('../../utils/DBUtils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Classement des invitations'),

	async execute(client, interaction, color) {

        try {
            let conn = await db.db.getConnection()
            let invitations = await conn.query('SELECT * FROM invitations')
            conn.release()
                
            if(invitations == "") return interaction.reply("Aucune invitation n'est à déplorer sur le serveur")
            let inv = invitations.filter(data => data.number).sort((a, b) => b.number - a.number)

    		let p0 = 0
    		let p1 = 10
            let list = []
            let i = 1

            await inv.forEach(invitation => {
                list.push(`**#${i++}** • <@${invitation.userid}> → **${invitation.number}**`)
            })

    		const embed = new Discord.EmbedBuilder()
    			.setTitle(`Classement » Invitations`)
    			.setFooter({text: `© 2022 - ${client.config.bot.name}`})
    			.setColor(color)
    			.setDescription(list.slice(p0, p1).join("\n"))
                .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${invitations.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})

    		await interaction.reply({embeds: [embed]})

            let authorid = interaction.user.id

            if(list.length > 10) {
                const embed = new Discord.EmbedBuilder()
                    .setTitle('Classement » Invitations')
                    .setColor(color)
                    .setDescription(list.slice(p0, p1).join("\n"))
                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${invitations.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                
                const bts = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('top1')
                            .setEmoji("◀️")
                            .setStyle("Primary")
                            .setDisabled(false),
                        )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('top2')
                            .setEmoji("▶️")
                            .setStyle("Primary")
                            .setDisabled(false),
                        )
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('topreset')
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
                        if(inte.user.id == authorid) {
                            
                            if(inte.customId == "top1") {
                                if((p0 - 10) <= 0 || p0 <= 0 || p0 == undefined || p1 == undefined) {
                                    p0 = 0
                                    p1 = 10
                                } else {
                                    p0 = p0 - 10
                                    p1 = p1 - 10
                                }

                                const embed = new Discord.EmbedBuilder()
                                    .setTitle('Classement » Invitations')
                                    .setColor(color)
                                    .setDescription(list.slice(p0, p1).join("\n"))
                                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${invitations.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                                
                                interaction.editReply({embeds: [embed]})
                                inte.deferUpdate()

                            }


                            if(inte.customId == "top2") {
                                if((p1 + 10) > list.length || p1 >= list.length || p0 == undefined || p1 == undefined) {
                                    p0 = list.length - 10
                                    p1 = list.length
                                } else {
                                    p0 = p0 + 10
                                    p1 = p1 + 10
                                }

                                const embed = new Discord.EmbedBuilder()
                                    .setTitle('Classement » Invitations')
                                    .setColor(color)
                                    .setDescription(list.slice(p0, p1).join("\n"))
                                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${invitations.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})

                                interaction.editReply({embeds: [embed]})
                                inte.deferUpdate()
                                
                            }

                            if(inte.customId == "topreset") {
                                p0 = 0
                                p1 = 10

                                const embed = new Discord.EmbedBuilder()
                                    .setTitle('Classement » Invitations')
                                    .setColor(color)
                                    .setDescription(list.slice(p0, p1).join("\n"))
                                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${invitations.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
                                
                                interaction.editReply({embeds: [embed]})
                                inte.deferUpdate()
                            }

                        } else {
                            interaction.deferUpdate()
                        }
                    }
                })
            }
        } catch (e) {
            interaction.reply({content: `[DATABASE ERROR] - Une erreur est survenue lors de la connexion à la base de données.\nConsulter la console pour en savoir plus.`})
            console.log(`[DATABASE ERROR][LEADERBOARD] - ${e}`)
        }
	}
}