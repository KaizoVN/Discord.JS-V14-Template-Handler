const {
    Collection,
    PermissionsBitField
} = require('discord.js');

module.exports = {
	name: "interactionCreate",

	async run(kaizo, interaction) {
        try {

            if (!interaction.guild || interaction.user.bot) return;

            if (interaction.channel.partial) await interaction.channel.fetch();
            // if (interaction.partial) await interaction.fetch();
            await interaction.guild.members.fetch({ force: true })

            if (interaction.isChatInputCommand()) {
                const command = kaizo.slashcommands.get(interaction.commandName);

                if (!command) return interaction.send(`An error occured while running this command !`)
                && kaizo.slashcommands.delete(interaction.commandName);

                const args = [];

                for (let option of interaction.options.data) {
                    if (option.type === ApplicationCommandOptionType.Subcommand) {
                        if (option.name) args.push(option.name);
                        option.options?.forEach(x => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }



                if (command) {
                    // --------------------- For owner bot -------------------- //
                    if (command.mode.developerOnly && interaction.user.id !== kaizo.config.settings.developer) {
                        return interaction.send('This command is limited to bot developers only !')
                    }
                    // --------------------- For owner guild -------------------- //
                    if (command.mode.ownerGuildOnly && interaction.user.id !== interaction.guild.ownerId) {
                        return interaction.reply('This command is limited to owner guild only !')
                    }

                    // --------------------- For permissions -------------------- //
                    if (command.permissions.bot) {
                        if (!interaction.guild.members.cache.get(kaizo.user.id).permissions.has(PermissionsBitField.resolve([`SendMessages`, `ViewChannel`, `AttachFiles`, `Speak`, `Connect`]))) {
                            return interaction.send('Looks like I missing the following permissions: \`SendMessages, ViewChannel, AttachFiles, CONNECT, SPEAK\`')
                        }

                        if (!interaction.guild.members.cache.get(kaizo.user.id).permissions.has(PermissionsBitField.resolve(command.permissions.bot || []))) {
                            return interaction.send(`Looks like I missing the following permissions: \`${command.permissions.bot || []}\``)
                            .catch((e) => {
                                console.log(e)
                            });;
                        }
                    }

                    if (command.permissions.user) {
                        if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.permissions.user || []))) {
                            return interaction.send(`Looks like you're missing the following permission: \`${command.permissions.user || []}\``)
                            .catch((e) => {
                                kaizo.logger.error(e)
                            });;
                        }
                    }

                    // --------------------- For cooldown -------------------- //
                    if (!kaizo.cooldowns.has(command.name)) {
                        kaizo.cooldowns.set(command.name, new Collection());
                    }

                    const timecooldowns = kaizo.cooldowns.get(command.name);

                    if (interaction.user.id !== kaizo.config.settings.developer) {
                        if (command.cooldown) {
                            if (timecooldowns.has(interaction.user.id)) {
                                const expTime = timecooldowns.get(interaction.user.id) + (command.cooldown * 1000)
                                if (Date.now() < expTime) {
                                    var timeLeft = (expTime - Date.now()) / 1000
                                    return interaction.reply({
                                        embeds: [kaizo.embeds.embedEditor(kaizo, interaction, false, `Please wait ${kaizo.utils.msToTime(timeLeft.toFixed(1) * 1000)} before using that command again!`)],
                                        ephemeral: true
                                    }).catch((err) => {
                                        kaizo.logger.error(err);
                                    });
                                }
                            }

                            timecooldowns.set(interaction.user.id, Date.now())
                            setTimeout(() => {
                                timecooldowns.delete(interaction.user.id)
                            }, command.cooldown * 1000)
                        }
                    };

                    command.run(kaizo, interaction, args, timecooldowns);
                }
            }
            
        } catch (e) {
            kaizo.logger.error(e);
        }
    }
}