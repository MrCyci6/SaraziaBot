const Discord = require('discord.js')

module.exports = async (client, oldMessage, newMessage) => {

    // ANTI PUB
    if(newMessage.author.id == client.user.id) return

    pub = [".gg"]
    if(pub.some(word => newMessage.content.toLowerCase().includes(word))) {

        if(client.config.owners.includes(newMessage.author.id)) return
        if(newMessage.channel.name.startsWith("ticket-")) return

        if(client.whitelisted_member.includes(newMessage.author.id)) return
        if(client.whitelisted_channel.includes(newMessage.channel.id)) return
        if(client.whitelisted_words.some(word => newMessage.content.toLowerCase().includes(word))) return
        
        newMessage.delete()

        let embed = new Discord.EmbedBuilder()
            .setTitle(`${newMessage.author.username}#${newMessage.author.discriminator == 0 ? "0000" : newMessage.author.discriminator}`)
            .setThumbnail(newMessage.author.displayAvatarURL({dynamic: true}))
            .setColor(client.config.embed.color)
            .setDescription(`Un message de pub envoyé par ${newMessage.author} dans le salon ${newMessage.channel} a été **détécté et supprimé**`)
            .addFields(
                {
                    name: `Message`,
                    value: `\`\`\`${newMessage.content}\`\`\``
                }
            )
            .setTimestamp()
            .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        let log = newMessage.guild.channels.cache.get(client.config.channels.logs)
        if(log) {
            log.send({embeds: [embed]})
        }
    }

    let embed = new Discord.EmbedBuilder()
        .setTitle(`${oldMessage.author.username}#${oldMessage.author.discriminator == 0 ? "0000" : oldMessage.author.discriminator}`)
    	.setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}))
        .setColor(client.config.embed.color)
        .setDescription(`Un message a été **modifié** par ${oldMessage.author} dans le salon ${oldMessage.channel}`)
        .addFields(
            {
                name: `Avant`,
                value: `\`\`\`${oldMessage.content}\`\`\``
            },
            {
                name: `Avant`,
                value: `\`\`\`${newMessage.content}\`\`\``
            }
        )
        .setTimestamp()
        .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    let log = oldMessage.guild.channels.cache.get(client.config.channels.logs)
    if(log) {
    	log.send({embeds: [embed]})
    }
}