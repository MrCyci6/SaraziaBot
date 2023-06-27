const { SlashCommandBuilder } = require('@discordjs/builders')
const ms = require('ms')

const { giveawaysMessages } = require('../../utils/giveawaysUtils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Lancer un giveaway')
        .addStringOption(option => option.setName('duration').setDescription("La durée du giveaway. Exemple: 1m, 1h, 1d").setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('Combien de gagnants le giveaway au sort devrait-il avoir ?').setRequired(true))
        .addStringOption(option => option.setName('prize').setDescription("Quel devrait être le prix du concours ?").setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription("Le salon dans lequel le giveaway doit être lancé").setRequired(true)),

	async execute(client, interaction, color) {

		if(client.config.owners.includes(interaction.user.id)) {

	        let giveawayChannel = interaction.options.getChannel('channel')
	        let giveawayDuration = interaction.options.getString('duration')
	        let giveawayWinnerCount = interaction.options.getInteger('winners')
	        let giveawayPrize = interaction.options.getString('prize')

	        client.giveawaysManager.start(giveawayChannel, {

	            duration: ms(giveawayDuration),

	            prize: giveawayPrize,

	            winnerCount: giveawayWinnerCount,

	            hostedBy: interaction.user,

	            messages: giveawaysMessages
	        });

        	interaction.reply(`Le Giveaway a commencé dans le channel:  ${giveawayChannel}!`);

	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}