const Discord = require("discord.js")

const db = require('../../utils/DBUtils.js')

module.exports = async (client) => {

    // WHITELIST
    try {
        
        let conn = await db.db.getConnection()

        let wlm = await conn.query('SELECT * FROM whitelisted_member')
        conn.release()

        if(wlm != "") {
            await wlm.forEach(whitelist => {
                client.whitelisted_member.push(whitelist.memberid)
            })
        }

        let wlc = await conn.query('SELECT * FROM whitelisted_channel')
        conn.release()

        if(wlc != "") {
            await wlc.forEach(whitelist => {
                client.whitelisted_channel.push(whitelist.channelid)
            })
        }

    } catch (e) {
        console.log(`[DATABASE ERROR][WHITELIST] - ${e}`)
    }

    // SLASHCOMMANDS
    const guild = client.guilds.cache.get(client.config.server.id)
    await guild.commands.set(client.command)

    // INVITATIONS
    client.guilds.cache.forEach(guild => {
        guild.invites.fetch()
        .then(invites => {

            const codeUses = new Map()
            invites.each(inv => codeUses.set(inv.code, inv.uses))

            client.invites.set(guild.id, codeUses)
        })
        .catch(err => {
            console.log(err)
        })
    })
    
    // ACTIVITY
    if(client.config.bot.statusType === "Listening") client.user.setActivity(`${client.config.bot.status}`, { type: Discord.ActivityType.Listening });
    if(client.config.bot.statusType === "Watching") client.user.setActivity(`${client.config.bot.status}`, { type: Discord.ActivityType.Watching });
    if(client.config.bot.statusType === "Playing") client.user.setActivity(`${client.config.bot.status}`, { type: Discord.ActivityType.Playing });
    if(client.config.bot.statusType === "Competing") client.user.setActivity(`${client.config.bot.status}`, { type: Discord.ActivityType.Competing }); 

    // CHANNELS
    let members = guild.channels.cache.get(client.config.channels.id_members)
    if(members) members.setName(`${client.config.channels.name_members.replace('{count}', guild.memberCount)}`)

    // READY
    console.log(`- Connecté ${client.user.username} : ${client.guilds.cache.size} serveurs`)
    console.log(`- Invitation : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    console.log(`- Made by @mrcyci6 with <3`)

}