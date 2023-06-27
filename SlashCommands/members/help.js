const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Aide'),

	async execute(client, interaction, color) {

		let cMember = []
		let cStaff = []
		let cOwner = []

		let author = interaction.guild.members.cache.get(interaction.user.id)

		if(client.config.owners.includes(interaction.user.id)) {

			let commands = readdirSync(`./SlashCommands/members/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/members/${file}`)
			 	cMember.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})
			
			commands = readdirSync(`./SlashCommands/staff/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/staff/${file}`)
			 	cStaff.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})

			commands = readdirSync(`./SlashCommands/owner/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/owner/${file}`)
			 	cOwner.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})

	    	const embed = new Discord.EmbedBuilder()
	    		.setTitle(`${client.config.bot.name} » Aide`)
	    		.setColor(color)
	    		.addFields(
	    			{
	    				name: `Membre`,
	    				value: `${cMember.join("\n")}`, 
                        inline: true
	    			},
	    			{
	    				name: `Staff`,
	    				value: `${cStaff.join("\n")}`, 
                        inline: true
	    			},
	    			{
	    				name: `Owner`,
	    				value: `${cOwner.join("\n")}`, 
                        inline: true
	    			}
	    		)
	    		.setFooter({text: `© 2022 - ${client.config.server.name} » By Kellogg's#0001`})

	    	interaction.reply({embeds: [embed]})
	    }
	    if(author.roles.cache.has(client.config.roles.staff)) {
	    	let commands = readdirSync(`./SlashCommands/members/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/members/${file}`)
			 	cMember.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})
			
			commands = readdirSync(`./SlashCommands/staff/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/staff/${file}`)
			 	cStaff.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})

	    	const embed = new Discord.EmbedBuilder()
	    		.setTitle(`${client.config.bot.name} » Aide`)
	    		.setColor(color)
	    		.addFields(
	    			{
	    				name: `Membre`,
	    				value: `${cMember.join("\n")}`
	    			},
	    			{
	    				name: `Staff`,
	    				value: `${cStaff.join("\n")}`
	    			}
	    		)
	    		.setFooter({text: `© 2022 - ${client.config.server.name} » By Kellogg's`})

	    	interaction.reply({embeds: [embed]})
	    }
	    if(!author.roles.cache.has(client.config.roles.staff) && !client.config.owners.includes(interaction.user.id)) {

	    	let commands = readdirSync(`./SlashCommands/members/`).filter(files => files.endsWith(".js"));
			
			commands.forEach(file => {
			    const getFileName = require(`../../SlashCommands/members/${file}`)
			 	cMember.push(`\`${getFileName.data.name}\`\n${getFileName.data.description}`)
			})

	    	const embed = new Discord.EmbedBuilder()
	    		.setTitle(`${client.config.bot.name} » Aide`)
	    		.setColor(color)
	    		.addFields(
	    			{
	    				name: `Membre`,
	    				value: `${cMember.join("\n")}`
	    			}
	    		)
	    		.setFooter({text: `© 2022 - ${client.config.server.name} » By Kellogg's`})

	    	interaction.reply({embeds: [embed]})
	    } 
	}
}