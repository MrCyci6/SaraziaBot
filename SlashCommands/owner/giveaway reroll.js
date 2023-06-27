const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reroll')
		.setDescription('Relancer le giveaway')
        .addStringOption(option => option.setName('giveaway').setDescription("Le giveaway à terminer (message ID ou prix du giveaway)").setRequired(true)),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {

	        const query = interaction.options.getString('giveaway')

		    const giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) || client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

	        if (!giveaway) {
	            return interaction.reply({content: 'Impossible de trouver un giveaway pour `'+ query + '`.', ephemeral: true });
	        }

	        if (!giveaway.ended) {
	            return interaction.reply({content: 'Le giveaway n\'est pas encore terminé.', ephemeral: true
	            });
	        }

	        client.giveawaysManager.reroll(giveaway.messageId).then(() => {
	            interaction.reply('Giveaway relancé');
	        })
	        .catch((e) => {
	            interaction.reply({content: e, ephemeral: true});
	        });

	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}