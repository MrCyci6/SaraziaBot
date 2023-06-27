const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription("Création d'embed"),

    async execute(client, interaction, color) {

        const msg_filter = m => m.author.id === interaction.user.id;

        const embedbase = new Discord.EmbedBuilder()
            .setDescription("** **")

        let menuoptions = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select1')
                    .setPlaceholder('Faites votre choix')
                    .addOptions([
                        { 
                            label: "Modifier le titre",
                            value: "title",
                        },
                        { 
                            label: "Supprimer le titre",
                            value: "supptitle",
                        },
                        { 
                            label: "Modifier la description",
                            value: "desc",
                        },
                        { 
                            label: "Supprimer la description", 
                            value: "suppdesc",
                        },
                        { 
                            label: "Modifier le footer",
                            value: "footer",
                        },
                        { 
                            label: "Supprimer le footer",
                            value: "suppfooter",
                        },
                        { 
                            label: "Modifier le thumbnail",
                            value: "thumbnail",
                        },
                        { 
                            label: "Modifier l'imagine", 
                            value: "picture",
                        },
                        { 
                            label: "Modifier l'url du titre", 
                            value: "url",
                        },
                        { 
                            label: "Modifier la couleur", 
                            value: "color",
                        },
                        { 
                            label: "Supprimer la couleur", 
                            value: "suppcolor",
                        },
                        {
                            label: "Ajouter un Timestamp",
                            value: "timestamp"
                        },
                        {
                            label: "Ajouter un Field",
                            value: "addfield"
                        }
                    ])
            )

            let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('valider')
                        .setLabel("✅ Valider")
                        .setStyle("Success")
                        .setDisabled(false),
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('edit')
                        .setLabel("📑 Copier un embed")
                        .setStyle("Secondary")
                        .setDisabled(false)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('reset')
                        .setLabel("❌ Tout effacer")
                        .setStyle("Danger")
                        .setDisabled(false)
                )

        if(client.config.owners.includes(interaction.user.id)) {
            let authorid = interaction.user.id
            //interaction.reply({content: "Configuration d'embed", ephemeral: false})
            interaction.deferReply();
            interaction.deleteReply();
            interaction.channel.send({embeds: [embedbase], components: [menuoptions, button]})
            .then(m => {
                client.on('interactionCreate', async (interaction) => {
                    if (authorid !== interaction.user.id) return;
                    if(interaction.message) {
                        if(interaction.message.id !== m.id) return;
                    }
                    if (interaction.isStringSelectMenu()) {
                        
                        if (interaction.customId == "select1") {
                            menuselection(interaction)
                            interaction.deferUpdate()
                        }
                    } else if(interaction.isButton()) {
                        if (interaction.customId === "reset") {
                            const embedbase = {
                              title: null,
                              type: 'rich',
                              description: "** **",
                              url: null,
                              timestamp: null,
                              color: 0x000000,
                              thumbnail: null,
                              image: null,
                              author: null
                            }

                            interaction.message.edit({embeds: [embedbase]})
                            interaction.deferUpdate()
                        } else if (interaction.customId === "valider") {
                            interaction.channel.send({content: `Dans quel salon je dois envoyer l'embed`}).then(question => {
                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                .then(cld => {

                                    question.delete()
                                    cld.first().delete()

                                    var msg = cld.first();
                                    const channel = msg.mentions.channels.first() || interaction.guild.channels.cache.get(msg.content)
                                    if(!channel) return interaction.channel.send(`Salon invalide`).then((mm) => mm.delete({ timeout: 15000 }))

                                    channel.send({embeds: [embedbase]})
                                    interaction.channel.send(`Embed envoyé dans ${channel}`)
                                });
                            })
                            interaction.deferUpdate()
                        } else if (interaction.customId === "edit") {

                            interaction.deferUpdate()
                            await interaction.channel.send("Quel est **le salon ou ce trouve le message à copier ?**").then(question => {
                                interaction.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']}).then(collected => {

                                    question.delete();
                                    collected.first().delete();

                                    const msg = collected.first()
                                    const channel = msg.mentions.channels.first() || interaction.guild.channels.cache.get(msg.content)
                                    if(!channel) return interaction.channel.send(`Aucun salon trouvé pour \`${channel_id.content}\``).then(msg => msg.delete({timeout: 50000}));
                                    
                                    interaction.channel.send("Quel est **le message de l'embed à copier ?** (**ID**)").then(question2 => {
                                        interaction.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']}).then(collected2 => {
                                            question2.delete();
                                            collected2.first().delete();
                                            
                                            const msg2 = collected2.first()
                                            if(!Number(msg2.content) || !interaction.channel.messages.fetch(msg2.content)) return interaction.channel.send('Message Invalide').then(msg => msg.delete({timeout: 50000}));
                                            
                                            const embed = interaction.channel.messages.fetch(msg2.content);

                                            embed.then(function(result) {
                                                if (result.embeds.length === 0) return interaction.channel.send("Ce message n'est pas un embed").then(msg => msg.delete({timeout: 50000}));
                                                
                                                if (result.partial) {
                                                    try {
                                                        result.fetch()
                                                    } catch (err){
                                                        return console.log(err)
                                                    }
                                                }
                                                interaction.message.edit({embeds: [result.embeds[0].toJSON()]})
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }
                })
                setTimeout(() => {
                    
                    m.edit({ components: [], embeds: [embedbase] })

                }, 60000 * 5)
                async function menuselection(interaction) {
                    switch (interaction.values[0]) {
                        case "title":
                            interaction.channel.send({content: `Quel est le nouveau **titre** de l'embed ?`}).then(mp => {
                                mp.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                    .then(cld => {

                                        var msg = cld.first();
                                        embedbase.setTitle(msg.content)
                                        m.edit({embeds: [embedbase]})
                                        mp.delete()
                                        cld.first().delete()

                                    });
                            })
                        break
                        case "addfield":
                            await interaction.channel.send({content: `Quel est le nouveau **titre** du Field ?`}).then(mp => {
                                mp.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                    .then(collected => {

                                        const namefield = collected.first()
                                        mp.delete()
                                        collected.first().delete()

                                        const footer = collected.first().content
                                        interaction.channel.send({content: `Quel est la nouvelle **description** du Field ?`}).then(question => {
                                            question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                                .then(cld => {

                                                    const valuefield = cld.first() 
                                                    question.delete()
                                                    cld.first().delete()

                                                    interaction.channel.send({content: `Voulez vous activer l'option **inline** \`oui\` ou \`non\``}).then(question2 => {
                                                        question2.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                                            .then(collected2 => {

                                                                const inlinefield = collected2.first()
                                                                question2.delete()
                                                                collected2.first().delete()

                                                                if (inlinefield.content == "oui") {
                                                                    embedbase.addFields({name: namefield.content, value: valuefield.content, inline: true})
                                                                    m.edit({embeds: [embedbase]})
                                                                } else {
                                                                    embedbase.addFields({name: namefield.content, value: valuefield.content, inline: false})
                                                                    m.edit({embeds: [embedbase]})
                                                                }
                                                            })
                                                    })
                                                                                                    
                                                })
                                        })
                                        

                                    }).catch(err => {
                                        interaction.channel.send(`La **Description** ou le **Titre** du field n'est pas valide`).then(ok => ok.delete({timeout: 15000}))
                                    })
                            })
                        break
                        case "supptitle":
                            embedbase.setTitle("")
                            m.edit({embeds: [embedbase]})
                        break
                        case "desc":
                            interaction.channel.send({content: `Quel est la nouvelle **description** de l'embed ?`}).then(mp => {
                                mp.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                    .then(cld => {

                                        var msg = cld.first();
                                        embedbase.setDescription(msg.content)
                                        m.edit({embeds: [embedbase]})
                                        mp.delete()
                                        cld.first().delete()

                                    });
                            }) 
                        break
                        case "suppdesc":
                            embedbase.setDescription("** **")
                            m.edit({embeds: [embedbase]})
                        break
                        case "footer":
                            await interaction.channel.send({content: `Quel est le nouveau **footer** de l'embed ?\nMentionner un membre pour prendre son **Avatar** et son **Pseudo**`}).then(mp => {
                                mp.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                    .then(collected => {
                                        mp.delete()
                                        collected.first().delete()

                                        if (collected.first().mentions.users.size <= 0) {
                                            const footer = collected.first().content
                                            interaction.channel.send({content: `Si vous ne voulez pas mettre d'**image** à votre **footer** écrivez \`non\``}).then(question => {
                                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                                .then(cld => {

                                                    question.delete()
                                                    cld.first().delete()

                                                    var msg = cld.first().content
                                                    const liens = [
                                                        "https://",
                                                        "http://",
                                                        "https",
                                                        "http"
                                                    ]
                                                    if (liens.some(word => msg.toLowerCase().includes(word))){
                                                        embedbase.setFooter({ text: footer, iconURL: msg})
                                                        m.edit({embeds: [embedbase]})
                                                    } else {
                                                        embedbase.setFooter({text: footer})
                                                        m.edit({embeds: [embedbase]})
                                                        interaction.channel.send("Vous avez choisi de ne pas ajouter d'**Avatar** au Footer ou le lien n'est **pas Valide** !").then((mm) => mm.delete({ timeout: 10000 }))
                                                    }
                                                })
                                            })
                                        } else if (collected.first().mentions.users.size > 0) {
                                            
                                            footer = collected.first().mentions.users.first();
                     
                                            embedbase.setFooter({ text: footer.username, iconURL: footer.displayAvatarURL({dynamic: true})});
                                            m.edit({embeds: [embedbase]})
                                        }

                                    }).catch( err => {
                                    
                                        interaction.channel.send("**Désolé mais je ne peux pas modifier le Footer !**").then((mm) => mm.delete({
                                            timeout: 10000
                                        }))
                                    })
                            })
                        break
                        case "suppfooter":
                            embedbase.setFooter({text: ""})
                            m.edit({embeds: [embedbase]})
                        break
                        case "timestamp":
                            embedbase.setTimestamp()
                            m.edit({embeds: [embedbase]})
                        break
                        case "thumbnail":
                            interaction.channel.send({content: `Quel est le nouveau **Thumbnail** de l'embed (\`lien\`)`}).then(question => {
                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                .then(cld => {

                                    question.delete()
                                    cld.first().delete()

                                    var msg = cld.first().content
                                    const liens = [
                                        "https://",
                                        "http://",
                                        "https",
                                        "http"
                                    ]
                                    if (liens.some(word => msg.toLowerCase().includes(word))){
                                        embedbase.setThumbnail(msg)
                                        m.edit({embeds: [embedbase]})
                                    } else {
                                        interaction.channel.send("Le lien n'est **pas Valide** !").then((mm) => mm.delete({ timeout: 10000 }))
                                        m.edit({embeds: [embedbase]})
                                    }
                                })
                            })
                        break
                        case "picture":
                            interaction.channel.send({content: `Quel est la nouvelle **image** de l'embed (\`lien\`)`}).then(question => {
                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                .then(cld => {

                                    question.delete()
                                    cld.first().delete()

                                    var msg = cld.first().content
                                    const liens = [
                                        "https://",
                                        "http://",
                                        "https",
                                        "http"
                                    ]
                                    if (liens.some(word => msg.toLowerCase().includes(word))){
                                        embedbase.setImage(msg)
                                        m.edit({embeds: [embedbase]})
                                    } else {
                                        interaction.channel.send("Le lien n'est **pas Valide** !").then((mm) => mm.delete({ timeout: 10000 }))
                                        m.edit({embeds: [embedbase]})
                                    }
                                })
                            })
                        break
                        case "url":
                            interaction.channel.send({content: `Quel est le nouveau **URL** de l'embed (\`lien\`)`}).then(question => {
                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                .then(cld => {

                                    question.delete()
                                    cld.first().delete()

                                    var msg = cld.first().content
                                    const liens = [
                                        "https://",
                                        "http://",
                                        "https",
                                        "http"
                                    ]
                                    if (liens.some(word => msg.toLowerCase().includes(word))){
                                        embedbase.setURL(msg)
                                        m.edit({embeds: [embedbase]})
                                    } else {
                                        interaction.channel.send("Le lien n'est **pas Valide** !").then((mm) => mm.delete({ timeout: 10000 }))
                                        m.edit({embeds: [embedbase]})
                                    }
                                })
                            })
                        break
                        case "color":
                            interaction.channel.send({content: `Quel est la nouvelle **couleur** de l'embed (\`lien\`)`}).then(question => {
                                question.channel.awaitMessages({filter: msg_filter, max: 1, time: 60000, errors: ['time']})
                                .then(cld => {

                                    question.delete()
                                    cld.first().delete()

                                    var msg = cld.first().content

                                    if (msg.startsWith('#')){
                                        embedbase.setColor(msg)
                                        m.edit({embeds: [embedbase]})
                                    } else {
                                        interaction.channel.send("La couleur n'est **pas Valide** !").then((mm) => mm.delete({ timeout: 10000 }))
                                        m.edit({embeds: [embedbase]})
                                    }
                                })
                            })
                        break
                        case "suppcolor":
                            embedbase.setColor("#000000")
                            m.edit({embeds: [embedbase]})
                        break
                    }
                }
            })
        } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
    }
}