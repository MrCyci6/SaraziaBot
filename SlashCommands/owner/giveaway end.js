const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('end')
		.setDescription('Fin du giveaway')
        .addStringOption(option => option.setName('giveaway').setDescription("Le giveaway à terminer (message ID ou prix du giveaway)").setRequired(true)),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {

	        const query = interaction.options.getString('giveaway')

		    const giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) || client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

	        if (!giveaway) {
	            return interaction.reply({content: 'Impossible de trouver un giveaway pour `'+ query + '`.', ephemeral: true });
	        }

	        if (giveaway.ended) {
	            return interaction.reply({content: 'Ce givetaway est déjà terminé.', ephemeral: true
	            });
	        }

	        client.giveawaysManager.end(giveaway.messageId).then(() => {
	            interaction.reply('Giveaway terminé!');
	        })
	        .catch((e) => {
	            interaction.reply({content: e, ephemeral: true});
	        });

	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}