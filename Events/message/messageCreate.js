const Discord = require('discord.js');
const fs = require('fs')
const cheerio = require('cheerio')
const moment = require('moment')

const db = require('../../utils/DBUtils.js')

module.exports = async (client, message) => {
	
	// TICKET SYSTEM
    if(message && message.channel && message.channel.name) {
        if(message.channel.name.startsWith("ticket-")) {
            try {

                if(message.author.id == client.user.id) return

                let ticketList = await fs.readdirSync("./tickets")
                if(ticketList.includes(message.channel.topic+"_"+message.channel.name+".html")) {

                    fs.readFile(`./tickets/${message.channel.topic}_${message.channel.name}.html`, 'utf-8', (err, data) => {
                        if(err) return console.log(err)

                        const $ = cheerio.load(data, { decodeEntities: false })

                        if(!($("#participants").text().includes(message.author.username))) {

                            $('#participants').append(`

                                <div class="user-box">
                                    <img
                                        src="{PARTICIPANT_URL}"><a>{PARTICIPANT_NAME}#{PARTICIPANT_DISCRIMINATOR}</a>
                                </div>`
                                .replaceAll("{PARTICIPANT_URL}", message.author.displayAvatarURL())
                                .replaceAll("{PARTICIPANT_NAME}", message.author.username)
                                .replaceAll("{PARTICIPANT_DISCRIMINATOR}", message.author.discriminator == 0 ? "0000" : message.author.discriminator))
                        }

                        if(message.attachments) {

                            let attachmentList = []
                            message.attachments.forEach(attachment => {
                                attachmentList.push(attachment.url)
                            })

                            $('#messages').append(`

                                <div class="message">
                                    <div class="avatar"><img src="{MESSAGE_URL}">
                                        <p>{MESSAGE_NAME}#{MESSAGE_DISCRIMINATOR}</p><a>{MESSAGE_DATE}</a>
                                    </div>

                                    <div class="message">
                                        <div class="content">
                                            <p>
                                                {MESSAGE_CONTENT}</p>
                                        </div>
                                    </div>
                                </div>`
                                .replaceAll("{MESSAGE_URL}", message.author.displayAvatarURL())
                                .replaceAll("{MESSAGE_NAME}", message.author.username)
                                .replaceAll("{MESSAGE_DISCRIMINATOR}", message.author.discriminator == 0 ? "0000" : message.author.discriminator)
                                .replaceAll("{MESSAGE_DATE}", moment(Date.now()).format("DD/MM/YYYY"))
                                .replaceAll("{MESSAGE_CONTENT}", message.content + "\n" + attachmentList.join("\n")))

                        } else {

                            $('#messages').append(`

                                <div class="message">
                                    <div class="avatar"><img src="{MESSAGE_URL}">
                                        <p>{MESSAGE_NAME}#{MESSAGE_DISCRIMINATOR}</p><a>{MESSAGE_DATE}</a>
                                    </div>

                                    <div class="message">
                                        <div class="content">
                                            <p>
                                                {MESSAGE_CONTENT}</p>
                                        </div>
                                    </div>
                                </div>`
                                .replaceAll("{MESSAGE_URL}", message.author.displayAvatarURL())
                                .replaceAll("{MESSAGE_NAME}", message.author.username)
                                .replaceAll("{MESSAGE_DISCRIMINATOR}", message.author.discriminator == 0 ? "0000" : message.author.discriminator)
                                .replaceAll("{MESSAGE_DATE}", moment(Date.now()).format("DD/MM/YYYY"))
                                .replaceAll("{MESSAGE_CONTENT}", message.content))
                        }

                        const newTicket = $.html()

                        fs.writeFile(`./tickets/${message.channel.topic}_${message.channel.name}.html`, newTicket, 'utf-8', err => {
                            if(err) return console.log(err)
                        })
                    })
                }

            } catch (e) {
                console.log(`[TRANSCRIPTION ERROR] - ${e}`)
            }
        }
    }

	// ANTI PUB
	if(message.author.id == client.user.id) return

	pub = [".gg"]
	if(pub.some(word => message.content.toLowerCase().includes(word))) {

		if(client.config.owners.includes(message.author.id)) return
		if(message.channel.name.startsWith("ticket-")) return

	    if(client.whitelisted_member.includes(message.author.id)) return
		if(client.whitelisted_channel.includes(message.channel.id)) return
		if(client.whitelisted_words.some(word => message.content.toLowerCase().includes(word))) return
		
		message.delete()

		try {

			let conn = await db.db.getConnection()
	        let sanctions = await conn.query(`SELECT number FROM anti_lien WHERE userid = "${message.author.id}"`)
	        conn.release()

			if(sanctions != "") {
				await db.query(`UPDATE anti_lien SET number = "${sanctions[0].number + 1}" WHERE userid = "${message.author.id}"`)

				// TODO SANCTIONS

			} else {
				await db.query(`INSERT INTO anti_lien (userid, username, number) VALUES ("${message.author.id}", "${message.author.username}#${message.author.discriminator == 0 ? "0000" : message.author.discriminator}", "1")`)
			}

		} catch (e) {
			let log = message.guild.channels.cache.get(client.config.channels.logs)
	        if(log) {
	        	log.send({content: `[DATABASE ERROR][ANTI-LIEN] - Une erreur est survenue lors de l'ajout d'une sanction dans la base de données.\nConsulter la console pour en savoir plus`})
	        }
			console.log(`[DATABASE ERROR][ANTI-LIEN] - ${e}`)
		}

        let embed = new Discord.EmbedBuilder()
            .setTitle(`${message.author.username}#${message.author.discriminator == 0 ? "0000" : message.author.discriminator}`)
        	.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setColor(client.config.embed.color)
            .setDescription(`Un message de pub envoyé par ${message.author} dans le salon ${message.channel} a été **détécté et supprimé**`)
            .addFields(
                {
                    name: `Message`,
                    value: `\`\`\`${message.content}\`\`\``
                }
            )
            .setTimestamp()
            .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        let log = message.guild.channels.cache.get(client.config.channels.logs)
        if(log) {
        	log.send({embeds: [embed]})
        }
        return
	}

	// SUGGEST
	if(message.channel.id === client.config.channels.suggestion) {

		try {
		    const embed = new Discord.EmbedBuilder()
		       	.setTitle('Vous pouvez juger cette suggesstion !')
		        .addFields(
		            { 
		            	name: '• Suggestion de :', 
		            	value: `${message.author.tag}`
		            },
		            { 
		               	name: '• Suggestion :', 
		               	value: `${message.content}`
		            }
		        )
		        .setColor(client.config.embed.color)
		        .setFooter({ text: `© 2022 - ${client.config.bot.name} » SUGGESTION`, iconURL: client.user.displayAvatarURL() })
		        .setThumbnail(message.author.displayAvatarURL())

		    message.channel.send({ embeds: [embed] }).then(embedMessage => {
		        embedMessage.react("✅")
		        embedMessage.react("❌")

		        embedMessage.startThread({ name: `Suggestion - ${message.author.username}`})

		        message.delete()
			})
		} catch (e) {
			console.log(e)
		}
	}
}