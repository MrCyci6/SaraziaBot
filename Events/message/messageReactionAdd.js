const Discord = require('discord.js')

module.exports = async (client, reaction, user) => {
    
    if(reaction.message.id === "1072451386337398825") {
    	if(reaction.emoji.name === "✅") {
            let guild = await client.guilds.cache.get(reaction.message.guildId)
            let author = await guild.members.cache.get(user.id)
            let role = await guild.roles.cache.get(client.config.roles.joueur)
            
            if(!role) return
            
            if(!author.roles.cache.has(role.id)) {
                try{
				    author.roles.add(role)
                    let embed = new Discord.EmbedBuilder()
                        .setTitle(`LOGS » RoleAdd`)
                        .setThumbnail(author.displayAvatarURL({dynamic: true}))
                        .setColor(client.config.embed.color)
                        .addFields(
                            {
                                name: `Utilisateur`,
                                value: `> ${author.user.username}#${author.user.discriminator}`
                            },
                            {
                                name: `Vérification règlement`,
                                value: `Réussi !`
                            }
                        )
                        .setFooter({ text: `© 2022 - ${client.config.bot.name} » LOGS`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })  
                    author.guild.channels.cache.get(client.config.channels.logs).send({embeds: [embed]})                    
                }catch(e){
                    let embed = new Discord.EmbedBuilder()
                        .setTitle(`LOGS » RoleAdd`)
                        .setThumbnail(author.displayAvatarURL({dynamic: true}))
                        .setColor(client.config.embed.color)
                        .addFields(
                            {
                                name: `Utilisateur`,
                                value: `> ${author.user.username}#${author.user.discriminator}`
                            },
                            {
                                name: `Vérification règlement`,
                                value: `${e}`
                            }
                        )
                        .setFooter({ text: `© 2022 - ${client.config.bot.name} » LOGS`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })  
                    author.guild.channels.cache.get(client.config.channels.logs).send({embeds: [embed]})                        
                }
                
            }
        }
    }
}