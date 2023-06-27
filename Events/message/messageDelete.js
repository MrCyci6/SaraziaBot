const Discord = require('discord.js');

module.exports = async (client, message, channel) => {

	const auditLogs = await message.guild.fetchAuditLogs({ type: '72' });
	const entry = auditLogs.entries.first();

	if (entry) {
		if(entry.executorId == client.user.id) return
		if(message.id != entry.extra.channel.lastMessageId) return

	    let embed = new Discord.EmbedBuilder()
	        .setTitle(`${message.author.username}#${message.author.discriminator == 0 ? "0000" : message.author.discriminator}`)
	    	.setThumbnail(message.author.displayAvatarURL({dynamic: true}))
	        .setColor(client.config.embed.color)
	        .setDescription(`Un message de ${message.author} a été **supprimé** par ${entry.executor} dans le salon ${message.channel}`)
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
	}
}