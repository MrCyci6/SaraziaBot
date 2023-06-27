module.exports = async (client, invite) => {

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
}
  