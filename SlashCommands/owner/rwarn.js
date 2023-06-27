const { SlashCommandBuilder } = require('@discordjs/builders')

const db = require('../../utils/DBUtils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rwarn')
        .setDescription("Supprimer un avertissement")
        .addStringOption(option => option.setName('id').setDescription("Id de l'avertissement").setRequired(true)),

    async execute(client, interaction, color) {

        if(client.config.owners.includes(interaction.user.id)) {

            var str_filter = interaction.guild.members.cache.filter(member => !member.bot)

            try {

                let id = interaction.options.getString('id')

                let conn = await db.db.getConnection()
                let res = await conn.query(`DELETE FROM warn WHERE id = "${id}"`)
                conn.release()

                if(res.affectedRows != 0) {
                    interaction.reply({content: `L'avertissement avec l'id **${id}** a bien été supprimé`})
                } else {
                    interaction.reply({content: `Il n'existe aucun avertissement avec l'id: **${id}**`})
                }

            } catch (e) {
                interaction.guild.channels.cache.get(client.config.channels.logs).send({content: `Une erreur est survenue lors de la suppression d'un avertissement dans la base de donnée.\nRegarder la console pour en savoir plus.`})
                return console.log(`[DATABASE ERROR] - ${e}`)
            }
            
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }

    }
}