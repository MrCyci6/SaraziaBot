const db = require('../../utils/DBUtils.js')
const Discord = require('discord.js')

module.exports = async (client, member) => {
	
	if(member.user.bot) return

	//	MEMBERS
    let members = member.guild.channels.cache.get(client.config.channels.id_members)
    if(members) members.setName(`${client.config.channels.name_members.replace('{count}', member.guild.memberCount)}`)

    // INVITES
    try {
	    let conn = await db.db.getConnection()
	    let inviter = await conn.query(`SELECT inviterid FROM invites WHERE memberid = "${member.user.id}"`)
	    conn.release()
		
	    if(inviter != "") {

	        let invitations = await conn.query(`SELECT number FROM invitations WHERE userid = "${inviter[0].inviterid}"`)
	        conn.release()

			if(invitations != "") {
				
				let inv = invitations[0].number
				await db.query(`UPDATE invitations SET number = "${inv - 1}" WHERE userid = "${inviter[0].inviterid}"`)

			}
			
			let res = await conn.query(`DELETE FROM invites WHERE memberid = "${member.user.id}"`)
			conn.release()
		
		}
	} catch (e) {
			member.guild.channels.cache.get(client.config.channels.logs).send({content: `[DATABASE ERROR] - Une erreur est survenue lors du retrait d'une invitation à la base de données.\nConsulter la console pour en savoir plus`})
			console.log(`[DATABASE ERROR][guildMemberRemove] - ${e}`)
	}

	// MSG BYE
    const channel = member.guild.channels.cache.get(client.config.channels.bye)
	const embed = new Discord.EmbedBuilder()
		.setTitle(`${client.config.server.name} a quitter`)
		.setColor(client.config.embed.color)
		.setFooter({text: `© 2022 - ${client.config.bot.name}`})
		.setDescription(`Bye bye ${member} !\nNous sommes désormais ${member.guild.memberCount} membres !`)
		.setThumbnail(client.user.displayAvatarURL())
    channel.send({embeds: [embed]})    
}