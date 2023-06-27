const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Information sur un membre')
		.addUserOption(option => option.setName('membre').setDescription("membre").setRequired(false)),

	async execute(client, interaction, color) {

		let member
		if(!interaction.options.getUser("membre")) {
			member = interaction.guild.members.cache.get(interaction.user.id)
		} else {
			member = interaction.guild.members.cache.get(interaction.options.getUser("membre").id)
		}

		try{

            let status;
            if (member.presence.status == "dnd") {
                status = "🔴 | Ne pas déranger";
            } else if (member.presence.status == "idle") {
                status = "🟠 | Afk";
            } else if (member.presence.status == "online") {
                status = "🟢 | En ligne";
            } else {
                status = "⚫️ | Hors ligne";
            }

            const userbot = member.user.bot

            const embed =new Discord.EmbedBuilder()
                .setTitle(`${member.user.tag}`)
                .setColor(color)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: "Rejoint le",
                        value: `\`${moment(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}\``
                    },
                    {
                        name: "Compte créé le",
                        value: `\`${moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}\``
                    },
                    {
                        name: "Informations basiques",
                        value: `\`Pseudo : ${member.user.username}
ID : ${member.user.id}
Hashtag : ${member.user.discriminator}\``
                    },
                    {
                        name: "Rôles",
                        value: `${member.roles.cache.map(r => r).join(', ')}`
                    }
                )
                .setFooter({text: `${status}`})
            interaction.reply({embeds: [embed]})
        } catch (e) {
            console.log(e)
        }
	}
}