const Discord = require('discord.js')

module.exports = async (client, oldRole, newRole) => {


	const auditLogs = await oldRole.guild.fetchAuditLogs({ type: '31' });
	const entry = auditLogs.entries.first();

	if(entry) {

		if(entry.changes) {

			entry.changes.forEach(change => {
				if(change.key == "permissions") {

				    let embed = new Discord.EmbedBuilder()
				        .setTitle(`${entry.executor.username}#${entry.executor.discriminator == 0 ? "0000" : entry.executor.discriminator}`)
				    	.setThumbnail(entry.executor.displayAvatarURL({dynamic: true}))
				        .setColor(client.config.embed.color)
				        .setDescription(`Les permissions du role ${oldRole} ont été **modifiées** par ${entry.executor}`)
				        .setTimestamp()
				        .setFooter({ text: `© 2022 - SaraziaLOG`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

				    let log = oldRole.guild.channels.cache.get(client.config.channels.logs)
				    if(log) {
				    	log.send({embeds: [embed]})
				    }
				}
			})
		}
	}
}