const { SlashCommandBuilder } = require('@discordjs/builders')

const stafflogs = require(`../../utils/stafflogs.js`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription("Supprimer des messages")
        .addIntegerOption(option => option.setName('nbrmessage').setDescription("Le nombre de message à supprimer").setRequired(true)
        ),

    async execute(client, interaction, color) {


		
		const amount = interaction.options.getInteger("nbrmessage");
   		let author = interaction.guild.members.cache.get(interaction.user.id);
        
        if(client.config.owners.includes(interaction.user.id) || author.roles.cache.has(client.config.roles.staff)) {

            await interaction.deferReply({ content: ":hourglass: Supressions des messages...", ephemeral: true });
            if (isNaN(amount) || amount > 99 || amount < 1) {
                return interaction.editReply({
                    content: "x: Nombre de message a supprimer invalide !",
                    ephemeral: true,
                });
            }
            await interaction.channel.bulkDelete(amount);
            await interaction.editReply({
                content: `:white_check_mark: ${amount} message(s) supprimé(s)`, ephemeral: true,
            });
            await stafflogs(client, author, author, "Clear", `${amount} messages supprimés`)
  
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }        
    }
}