const Discord = require('discord.js')

module.exports = async (client, oldMember, newMember) => {
	if(oldMember.roles.cache.size > newMember.roles.cache.size) {

		// REMOVE
        
        if(oldMember.roles.cache.has(client.config.roles.soutien) && !newMember.roles.cache.has(client.config.roles.soutien)) return
        
        setTimeout(async () => {
            const auditLogs = await oldMember.guild.fetchAuditLogs({ type: '31' });
            const entry = auditLogs.entries.first();
            if (entry) {

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`${oldMember.user.username}#${oldMember.user.discriminator == 0 ? "0000" : oldMember.user.discriminator}`)
                    .setThumbnail(oldMember.user.displayAvatarURL({dynamic: true}))
                    .setColor(client.config.embed.color)
                    .setDescription(`Un role a été **retiré** à ${oldMember} par ${entry.executor}`)
                    .addFields(
                        {
                            name: `Roles`,
                            value: `${newMember.roles.cache.map(r => r).join(', ')}`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                let log = oldMember.guild.channels.cache.get(client.config.channels.logs)
                if(log) {
                    log.send({embeds: [embed]})
                }

            } else {

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`${oldMember.user.username}#${oldMember.user.discriminator == 0 ? "0000" : oldMember.user.discriminator}`)
                    .setThumbnail(oldMember.user.displayAvatarURL({dynamic: true}))
                    .setColor(client.config.embed.color)
                    .setDescription(`Un role a été **retiré** à ${oldMember}`)
                    .addFields(
                        {
                            name: `Roles`,
                            value: `${newMember.roles.cache.map(r => r).join(', ')}`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                let log = oldMember.guild.channels.cache.get(client.config.channels.logs)
                if(log) {
                    log.send({embeds: [embed]})
                }
            }
        }, 1000)

	} else {
        
		// ADD
        
        if(!oldMember.roles.cache.has(client.config.roles.soutien) && newMember.roles.cache.has(client.config.roles.soutien)) return
        
        setTimeout(async () => {
            const auditLogs = await oldMember.guild.fetchAuditLogs({ type: '31' });
            const entry = auditLogs.entries.first();
            if (entry) {

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`${oldMember.user.username}#${oldMember.user.discriminator == 0 ? "0000" : oldMember.user.discriminator}`)
                    .setThumbnail(oldMember.user.displayAvatarURL({dynamic: true}))
                    .setColor(client.config.embed.color)
                    .setDescription(`Un role a été **ajouté** à ${oldMember} par ${entry.executor}`)
                    .addFields(
                        {
                            name: `Roles`,
                            value: `${newMember.roles.cache.map(r => r).join(', ')}`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                let log = oldMember.guild.channels.cache.get(client.config.channels.logs)
                if(log) {
                    log.send({embeds: [embed]})
                }

            } else {

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`${oldMember.user.username}#${oldMember.user.discriminator == 0 ? "0000" : oldMember.user.discriminator}`)
                    .setThumbnail(oldMember.user.displayAvatarURL({dynamic: true}))
                    .setColor(client.config.embed.color)
                    .setDescription(`Un role a été **ajouté** à ${oldMember}`)
                    .addFields(
                        {
                            name: `Roles`,
                            value: `${newMember.roles.cache.map(r => r).join(', ')}`
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                let log = oldMember.guild.channels.cache.get(client.config.channels.logs)
                if(log) {
                    log.send({embeds: [embed]})
                }
            }
        }, 1000)
	}
}