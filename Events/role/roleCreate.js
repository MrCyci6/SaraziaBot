const Discord = require('discord.js')

module.exports = async (client, role) => {

	const auditLogs = await role.guild.fetchAuditLogs({ type: '30' });
	const entry = auditLogs.entries.first();

	if (entry) {

	    let embed = new Discord.EmbedBuilder()
	        .setTitle(`${entry.executor.username}#${entry.executor.discriminator == 0 ? "0000" : entry.executor.discriminator}`)
	    	.setThumbnail(entry.executor.displayAvatarURL({dynamic: true}))
	        .setColor(client.config.embed.color)
	        .setDescription(`Le role ${role} a été **créé** par ${entry.executor}`)
	        .setTimestamp()
	        .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

	    let log = role.guild.channels.cache.get(client.config.channels.logs)
	    if(log) {
	    	log.send({embeds: [embed]})
	    }
	}
}