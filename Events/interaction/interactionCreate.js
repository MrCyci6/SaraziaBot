const Discord = require('discord.js')
const moment = require('moment')
const fs = require('fs')
const cheerio = require('cheerio')

const ticketLog = require('../../utils/ticketLog.js')
const db = require('../../utils/DBUtils.js')

module.exports = async (client, interaction) => {
	try {

	    if(interaction.isCommand()) {
	    	const color = client.config.embed.color
			const cmd = client.commands.get(interaction.commandName)
			if(cmd) await cmd.execute(client, interaction, color)
		}

		if(interaction.isModalSubmit()) {

			let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('claim')
                        .setLabel("✅ Prendre en charge")
                        .setStyle("Success")
                        .setDisabled(false),
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('supp')
                        .setLabel("❌ Supprimer")
                        .setStyle("Danger")
                        .setDisabled(false)
                )

		    let DejaUnChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)
			let form = await interaction.fields.fields

			if(DejaUnChannel) return interaction.reply({content: `:x: Vous avez déjà un ticket d'ouvert`, ephemeral: true})

			let pseudo
			let type
			let description
			let other

			form.forEach(t => {
				if(t.customId === "pseudo") pseudo = t.value

				if(t.customId === "type") type = t.value

				if(t.customId === "description") description = t.value
			})

			let c = await interaction.guild.channels.create({
				name: `ticket-${interaction.user.username}_${moment(Date.now()).format("DD-MM-YYYY")}`,
		        type: 0,
		        topic: `${interaction.user.id}`,
		        parent: `${client.config.categories.ticket}`,
		        permissionOverwrites: [
		            {   
		                id: interaction.guild.id,
		                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
		            },
		            {
		                id: interaction.user.id,
		                allow: [Discord.PermissionsBitField.Flags.ViewChannel],
		                deny: [Discord.PermissionsBitField.Flags.SendMessages]
		            },
		            {
		                id: client.config.roles.staff,
		                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
		            }
		        ]
		    })

	        const partenariat = new Discord.EmbedBuilder()
	            .setTitle(`🎟️ ${type}`)
	            .setColor(client.config.embed.color)
	            .setDescription(`Bonjour et merci d'avoir contacté le **support de ${client.config.bot.name}**\n**Voici les informations que vous nous avez transmis:**\n\n**Support**: ${type}\n**Pseudo**: ${pseudo}\n**Description**:\n${description}\n\nMerci d'attendre qu'un staff prenne votre ticket en charge`)
	            .setFooter({text: `© 2022 - ${client.config.bot.name}`, iconURL: client.user.displayAvatarURL({dynamic: true})})

	        c.send({embeds: [partenariat], content: `${interaction.user}`, components: [button]})
	        interaction.reply({content: `:white_check_mark: Votre ticket à été ouvert avec succès. <#${c.id}>`, ephemeral: true})

	        try {
		        fs.readFile('./tickets/ticket-template.html', 'utf-8', (err, data) => {
					if(err) return console.log(err)

					const $ = cheerio.load(data, { decodeEntities: false })

					$('#participants').append(`

                        <div class="user-box">
                            <img
                                src="{PARTICIPANT_URL}"><a>{PARTICIPANT_NAME}#{PARTICIPANT_DISCRIMINATOR}</a>
                        </div>`
						.replaceAll("{PARTICIPANT_URL}", interaction.user.displayAvatarURL())
						.replaceAll("{PARTICIPANT_NAME}", interaction.user.username)
						.replaceAll("{PARTICIPANT_DISCRIMINATOR}", interaction.user.discriminator == 0 ? "0000" : interaction.user.discriminator))

					const newTicket = $.html().replaceAll("{CREATOR_NAME}", interaction.user.username)
						.replaceAll("{CREATOR_DISCRIMINATOR}", interaction.user.discriminator == 0 ? "0000" : interaction.user.discriminator)
						.replaceAll('{CREATOR_ID}', interaction.user.id)
						.replaceAll("{TICKET_DATE}", moment(Date.now()).format("DD/MM/YYYY"))
						.replaceAll("{TICKET_NAME}", c.name)
						.replaceAll("{SUPPORT}", type)
						.replaceAll("{PSEUDO}", pseudo)
						.replaceAll("{DESCRIPTION}", description)

					fs.writeFile(`./tickets/${interaction.user.id}_${c.name}.html`, newTicket, 'utf-8', err => {
						if(err) return console.log(err)
					})
				})
			} catch (e) {
				console.log(`[TRANSCRIPTION ERROR] - ${e}`)
			}

	        try {
				await db.query(`INSERT INTO tickets (openuserid, channelid) VALUES ("${interaction.user.id}", "${c.id}")`)
	        } catch (e) {
	        	interaction.reply({content: `[DATABASE ERROR][TICKET] - Une erreur est survenue lors de la connexion à la base de données.\nConsulter la console pour plus d'informations`, ephemeral: true})
	        	console.log(`[DATABASE ERROR][TICKET] - ${e}`)
	        }
 
		}

		if(interaction.isButton()) {

			if(interaction.customId === "claim") {

				let button = new Discord.ActionRowBuilder()
	                .addComponents(
	                    new Discord.ButtonBuilder()
	                        .setCustomId('claim')
	                        .setLabel("✅ Prendre en charge")
	                        .setStyle("Success")
	                        .setDisabled(true),
	                )
	                .addComponents(
	                    new Discord.ButtonBuilder()
	                        .setCustomId('supp')
	                        .setLabel("❌ Supprimer")
	                        .setStyle("Danger")
	                        .setDisabled(false)
	                )

				let author = interaction.guild.members.cache.get(interaction.user.id)
				let perm = false
				if(client.config.owners.includes(interaction.user.id)) perm = true
				if(author.roles.cache.has(client.config.roles.staff)) perm = true 
				if(!perm) return interaction.reply({ephemeral:true, content: client.config.messages.noperm})
				
				interaction.channel.permissionOverwrites.set([
					{
						id: interaction.channel.topic,
						allow: [Discord.PermissionsBitField.Flags.SendMessages, Discord.PermissionsBitField.Flags.ViewChannel]
					},
		            {
		                id: client.config.roles.staff,
		                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
		            },
		            {   
		                id: interaction.guild.id,
		                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
		            }
				])
				interaction.reply({content: `${interaction.user} vient de prendre en charge le ticket !`})
				interaction.message.edit({components: [button]})

			}
			if(interaction.customId === "supp") {
				
				try {
					let conn = await db.db.getConnection()
				    let ticketInfos = await conn.query(`SELECT * FROM tickets WHERE channelid = "${interaction.channel.id}"`)
				    conn.release()

				    if(ticketInfos != "") {
				    	let openUser = interaction.guild.members.cache.get(ticketInfos[0].openuserid)
				    	let openDate = moment(ticketInfos[0].opendate).format('DD/MM/YYYY')

						await conn.query(`DELETE FROM tickets WHERE channelid = "${interaction.channel.id}"`)
						conn.release()

				    	let closeUser = interaction.guild.members.cache.get(interaction.user.id)
				    	let closeDate = moment(Date.now()).format('DD/MM/YYYY')

				    	if(!openUser) return
				    	ticketLog(client, openUser, closeUser, openDate, closeDate, interaction.channel.name, interaction.channel.topic, ticketInfos[0].id)
				    }
				} catch (e) {
					console.log(`[DATABASE ERROR][TICKET] - ${e}`)
				}
				
				interaction.channel.delete()
			}
			if(interaction.customId === "create") {

				let modal = new Discord.ModalBuilder()
					.setCustomId("ticket")
					.setTitle("Création de ticket")

				let pseudo = new Discord.TextInputBuilder()
					.setCustomId('pseudo')
					.setLabel('Quel est votre pseudo ?')
					.setStyle(Discord.TextInputStyle.Short) 

				let type = new Discord.TextInputBuilder()
					.setCustomId('type')
					.setLabel('Quel est le type de ticket ?')
					.setStyle(Discord.TextInputStyle.Short) 

				let description = new Discord.TextInputBuilder()
					.setCustomId('description')
					.setLabel('Quelle est la description de votre demande ?')
					.setStyle(Discord.TextInputStyle.Paragraph) 

				let ps = new Discord.ActionRowBuilder().addComponents(pseudo)
				let ty = new Discord.ActionRowBuilder().addComponents(type)
				let de = new Discord.ActionRowBuilder().addComponents(description)

				modal.addComponents(ps, ty, de)

				await interaction.showModal(modal)
			}
			if(interaction.customId === "event") {

				let role = interaction.guild.roles.cache.get(client.config.roles.notif_events)
				if(!role) return
				let author = interaction.guild.members.cache.get(interaction.user.id)
				if(author.roles.cache.has(role.id)) {
					author.roles.remove(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être retiré`, ephemeral: true})
				} else {
					author.roles.add(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être ajouté`, ephemeral: true})
				}

			} else if(interaction.customId === "sondage") {
				
				let role = interaction.guild.roles.cache.get(client.config.roles.notif_sondages)
				if(!role) return
				let author = interaction.guild.members.cache.get(interaction.user.id)
				if(author.roles.cache.has(role.id)) {
					author.roles.remove(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être retiré`, ephemeral: true})
				} else {
					author.roles.add(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être ajouté`, ephemeral: true})
				}

			} else if(interaction.customId === "changelog") {
				
				let role = interaction.guild.roles.cache.get(client.config.roles.notif_changelogs)
				if(!role) return
				let author = interaction.guild.members.cache.get(interaction.user.id)
				if(author.roles.cache.has(role.id)) {
					author.roles.remove(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être retiré`, ephemeral: true})
				} else {
					author.roles.add(role)
					interaction.reply({content: `Le rôle ${role} vient de vous être ajouté`, ephemeral: true})
				}

			}

		}

	} catch (err) {
		console.log(err)
	}
}