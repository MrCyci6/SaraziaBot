const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

const db = require('../../utils/DBUtils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bypasslink')
		.setDescription('Ajouter ou retire un member/salon à la whitelist de l\'anti lien')
		.addSubcommand((subcommand) => 
		  	subcommand
		    	.setName('salon')
		    	.setDescription('Ajouter ou retirer un salon à la whitelist')
		    	.addChannelOption((option) => 
			      	option
			        	.setName('channel')
			        	.setDescription('Salon à ajouter/retirer')
			        	.setRequired(true)
			    )
		)
		.addSubcommand((subcommand) => 
		  	subcommand
		    	.setName('membre')
		    	.setDescription('Sets the channel to send earthquake logs.')
		    	.addUserOption((option) => 
			      	option
			        	.setName('user')
			        	.setDescription('Membre à ajouter/retirer')
			        	.setRequired(true)
			    )
		)
		.addSubcommand((subcommand) => 
		  	subcommand
		    	.setName('list')
		    	.setDescription('Lister les membres/salons dans la whitelist')
		    	.addStringOption((option) => 
			      	option
			        	.setName('type')
			        	.setDescription('Quelle liste voulez vous voir')
			        	.setRequired(true)
			        	.addChoices(
			        		{ name: 'membre', value: 'member' },
			        		{ name: 'salon', value: 'channel' }
			    		)
			    )
		),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {

			let subCommand = await interaction.options.getSubcommand()
			let conn = await db.db.getConnection()

			switch(subCommand) {

				case "salon":
					
					try {
						let channel = await interaction.options.getChannel('channel')
						
				        let channelId = await conn.query(`SELECT channelid FROM whitelisted_channel WHERE channelid = "${channel.id}"`)
				        conn.release()

						if(channelId != "") {

							await db.query(`DELETE FROM whitelisted_channel WHERE channelid = "${channel.id}"`)

							client.whitelisted_channel = client.whitelisted_channel.filter((item) => item != channel.id)
							
							interaction.reply({content: `Tu viens de supprimer le salon ${channel} de la whitelist`})

						} else {

							await db.query(`INSERT INTO whitelisted_channel (channelid, channelname) VALUES ("${channel.id}", "${channel.name}")`)

							client.whitelisted_channel.push(channel.id)
							
							interaction.reply({content: `Tu viens d'ajouter le salon ${channel} de la whitelist`})
						}

					} catch (e) {
						interaction.reply({content: `Une erreure s'est produite lors de la connexion à la base de données.\nConsulter la console pour en savoir plus`, ephemeral: true})
						console.log(`[DATABASE ERROR][BYPASSLINK] - ${e}`)
					}

					break;

				case "membre":
					
					try {
						let member = await interaction.guild.members.cache.get(interaction.options.getUser('user').id)
						
				        let memberId = await conn.query(`SELECT memberid FROM whitelisted_member WHERE memberid = "${member.user.id}"`)
				        conn.release()

						if(memberId != "") {

							await db.query(`DELETE FROM whitelisted_member WHERE memberid = "${member.user.id}"`)

							client.whitelisted_member = client.whitelisted_member.filter((item) => item != member.id)
							
							interaction.reply({content: `Tu viens de supprimer le member ${member} de la whitelist`})

						} else {

							await db.query(`INSERT INTO whitelisted_member (memberid, membername) VALUES ("${member.user.id}", "${member.user.username}#${member.user.discriminator == 0 ? "0000" : member.user.discriminator}")`)

							client.whitelisted_member.push(member.id)
							
							interaction.reply({content: `Tu viens d'ajouter le member ${member} de la whitelist`})
						}

					} catch (e) {
						interaction.reply({content: `Une erreure s'est produite lors de la connexion à la base de données.\nConsulter la console pour en savoir plus`, ephemeral: true})
						console.log(`[DATABASE ERROR][BYPASSLINK] - ${e}`)
					}

					break;

				case "list":

					let choice = interaction.options.getString('type')

					if(choice == "member") {

						try {
							let wlm = await conn.query('SELECT * FROM whitelisted_member')
			                conn.release()
                
                			if(wlm == "") return interaction.reply({content: `Aucun membre whitelist sur le serveur`})
			                
			                let p0 = 0
			                let p1 = 10
			                let list = []

			                await wlm.forEach(whitelist => {
			                    list.push(`**#${whitelist.id}** • **${whitelist.membername}** (**${whitelist.memberid}**)`)
			                })

			                const embed = new Discord.EmbedBuilder()
			                    .setTitle('Liste des membres whitelist')
			                    .setColor(color)
			                    .setDescription(list.slice(p0, p1).join("\n"))
			                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wlm.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})

			                await interaction.reply({embeds: [embed]})

			                if(list.length > 10) {
			                    const embed = new Discord.EmbedBuilder()
			                        .setTitle('Liste des membres whitelist')
			                        .setColor(color)
			                        .setDescription(list.slice(p0, p1).join("\n"))
			                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wlm.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                    
			                    const bts = new Discord.ActionRowBuilder()
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('memberleft')
			                                .setEmoji("◀️")
			                                .setStyle("Primary")
			                                .setDisabled(false),
			                            )
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('memberright')
			                                .setEmoji("▶️")
			                                .setStyle("Primary")
			                                .setDisabled(false),
			                            )
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('memberreset')
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

			                                if(inte.customId == "memberleft") {
			                                    if((p0 - 10) <= 0 || p0 <= 0 || p0 == undefined || p1 == undefined) {
			                                        p0 = 0
			                                        p1 = 10
			                                    } else {
			                                        p0 = p0 - 10
			                                        p1 = p1 - 10
			                                    }

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des membres whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wlm.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
			                                    interaction.editReply({embeds: [embed]})
			                                    inte.deferUpdate()

			                                }


			                                if(inte.customId == "memberright") {
			                                    if((p1 + 10) > list.length || p1 >= list.length || p0 == undefined || p1 == undefined) {
			                                        p0 = list.length - 10
			                                        p1 = list.length
			                                    } else {
			                                        p0 = p0 + 10
			                                        p1 = p1 + 10
			                                    }

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des membres whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wlm.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
			                                    interaction.editReply({embeds: [embed]})
			                                    inte.deferUpdate()
			                                    
			                                }

			                                if(inte.customId == "memberreset") {
			                                    p0 = 0
			                                    p1 = 10

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des membres whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wlm.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
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
							interaction.reply({content: `Une erreur est survenue lors de la connexion à la base de données.\nConsulter la console pour en savoir plus`})
							console.log(`[DATABASE ERROR][BYPASSLINK] - ${e}`)
						}

					}
					if(choice == "channel") {

						try {
							let wl = await conn.query('SELECT * FROM whitelisted_channel')
			                conn.release()
                
                			if(wl == "") return interaction.reply({content: `Aucun salon whitelist sur le serveur`})
			                
			                let p0 = 0
			                let p1 = 10
			                let list = []

			                await wl.forEach(whitelist => {
			                    list.push(`**#${whitelist.id}** • **${whitelist.channelname}** (**${whitelist.channelid}**)`)
			                })

			                const embed = new Discord.EmbedBuilder()
			                    .setTitle('Liste des salons whitelist')
			                    .setColor(color)
			                    .setDescription(list.slice(p0, p1).join("\n"))
			                    .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wl.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})

			                await interaction.reply({embeds: [embed]})

			                if(list.length > 10) {
			                    const embed = new Discord.EmbedBuilder()
			                        .setTitle('Liste des salons whitelist')
			                        .setColor(color)
			                        .setDescription(list.slice(p0, p1).join("\n"))
			                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wl.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                    
			                    const bts = new Discord.ActionRowBuilder()
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('channeleft')
			                                .setEmoji("◀️")
			                                .setStyle("Primary")
			                                .setDisabled(false),
			                            )
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('channelright')
			                                .setEmoji("▶️")
			                                .setStyle("Primary")
			                                .setDisabled(false),
			                            )
			                        .addComponents(
			                            new Discord.ButtonBuilder()
			                                .setCustomId('channelreset')
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

			                                if(inte.customId == "channeleft") {
			                                    if((p0 - 10) <= 0 || p0 <= 0 || p0 == undefined || p1 == undefined) {
			                                        p0 = 0
			                                        p1 = 10
			                                    } else {
			                                        p0 = p0 - 10
			                                        p1 = p1 - 10
			                                    }

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des salons whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wl.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
			                                    interaction.editReply({embeds: [embed]})
			                                    inte.deferUpdate()

			                                }


			                                if(inte.customId == "channelright") {
			                                    if((p1 + 10) > list.length || p1 >= list.length || p0 == undefined || p1 == undefined) {
			                                        p0 = list.length - 10
			                                        p1 = list.length
			                                    } else {
			                                        p0 = p0 + 10
			                                        p1 = p1 + 10
			                                    }

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des salons whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wl.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
			                                    interaction.editReply({embeds: [embed]})
			                                    inte.deferUpdate()
			                                    
			                                }

			                                if(inte.customId == "channelreset") {
			                                    p0 = 0
			                                    p1 = 10

			                                    const embed = new Discord.EmbedBuilder()
			                                        .setTitle('Liste des salons whitelist')
			                                        .setColor(color)
			                                        .setDescription(list.slice(p0, p1).join("\n"))
			                                        .setFooter({text: `© 2022 - ${client.config.bot.name} » Total: ${wl.length} | by Kellogg's`, iconURL: client.user.displayAvatarURL({dynamic: true})})
			                                    
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
							interaction.reply({content: `Une erreur est survenue lors de la connexion à la base de données.\nConsulter la console pour en savoir plus`})
							console.log(`[DATABASE ERROR][BYPASSLINK] - ${e}`)
						}

					}

					break;
			}

	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}