const Discord = require('discord.js')

const db = require('../../utils/DBUtils.js')
const dmlogs = require(`../../utils/dmlogs.js`)

module.exports = async (client, member) => {

    if(member.user.bot) return

    // BAN CHECK
	let conn = await db.db.getConnection()
    let bans = await conn.query(`SELECT userid FROM banned WHERE userid = "${member.user.id}"`)
    conn.release()

    if(bans != "") {
        
        await dmlogs(client, client, member, "Bannissement", `${reason || `Aucune raison`}`)

        await member.guild.members.ban(member.id, { reason: `Présent dans la banlist` }).catch((error) => {})

    } else {

	    // AUTO MENTION
	    const automention = client.config.channels.automention
	    if(automention) {

	        automention.forEach(async channel => {

	            const channels = member.guild.channels.cache.get(channel)
	            if(!channels) return

	            let m = await channels.send(`${member}`)

	            setTimeout(() => {
	                m.delete()
	            }, 2 * 1000)
	        })
	    }

		if(member.user.bot) return

		//MEMBERS
		let guild = member.guild
	    let members = guild.channels.cache.get(client.config.channels.id_members)
	    if(members) members.setName(`${client.config.channels.name_members.replace('{count}', guild.memberCount)}`)

		// MSG BIENVENUE
		const cachedInvites = member.client.invites.get(member.guild.id)
		const invitesList = await member.guild.invites.fetch()
		const invite = invitesList.find(inv => cachedInvites.get(inv.code) < inv.uses)

		const channel = member.guild.channels.cache.get(client.config.channels.bienvenue)
		const role = member.guild.roles.cache.get(client.config.roles.joueur)
		if(!channel) return

		if(invite) {

			try {
				let conn = await db.db.getConnection()
		        let invitations = await conn.query(`SELECT number FROM invitations WHERE userid = "${invite.inviter.id}"`)
		        conn.release()

		        let inv = 0
				if(invitations != "") {
					inv = invitations[0].number
					await db.query(`UPDATE invitations SET number = "${inv + 1}" WHERE userid = "${invite.inviter.id}"`)
				} else {
					inv = 0
					await db.query(`INSERT INTO invitations (userid, username, number) VALUES ("${invite.inviter.id}", "${invite.inviter.username}", "1")`)
				}

				const embed = new Discord.EmbedBuilder()
					.setTitle(`Bienvenue sur Sarazia | 100% Farm2Win`)
					.setColor(client.config.embed.color)
					.setFooter({text: `© 2022 - ${client.config.bot.name}`})
					.setDescription(`Bienvenue ${member} !\nTu es ici grâce à ${invite.inviter.tag} (${inv + 1} invitations)\nNous sommes désormais ${member.guild.memberCount} membres !`)
					.setThumbnail(client.user.displayAvatarURL())
				channel.send({embeds: [embed]})

				await db.query(`INSERT INTO invites (inviterid, memberid) VALUES ("${invite.inviter.id}", "${member.id}")`)

				invitesList.each(inv => cachedInvites.set(inv.code, inv.uses))
				member.client.invites.set(member.guild.id, cachedInvites)

				if(!role) return
				member.roles.add(role)

			} catch (e) {
				member.guild.channels.cache.get(client.config.channels.logs).send({content: `[DATABASE ERROR] - Une erreur est survenue lors de l'ajout d'une invitation à la base de données.\nConsulter la console pour en savoir plus`})
				console.log(`[DATABASE ERROR][guildMemberAdd] - ${e}`)
			}

		}
		else {

			const embed = new Discord.EmbedBuilder()
				.setTitle(`Bienvenue sur Sarazia | 100% Farm2Win`)
				.setColor(client.config.embed.color)
				.setFooter({text: `© 2022 - ${client.config.bot.name}`})
				.setDescription(`Bienvenue ${member} !\nNous sommes désormais ${member.guild.memberCount} membres !`)
				.setThumbnail(client.user.displayAvatarURL())

			channel.send({embeds: [embed]})
			if(!role) return
			member.roles.add(role)
		}
	}
}