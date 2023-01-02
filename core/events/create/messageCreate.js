const {
    Collection,
    PermissionsBitField
} = require('discord.js');

module.exports = {
	name: "messageCreate",

	async run(kaizo, interaction) {
        try {

            if (!interaction.guild || interaction.author.bot) return;

            if (interaction.channel.partial) await interaction.channel.fetch();
            if (interaction.partial) await interaction.fetch();
            await interaction.guild.members.fetch({ force: true })

            const mentionRegPrefix = new RegExp(`^<@!?${kaizo.user.id}>`);

            const botPrefix = kaizo.config.bot.prefix;
            const prefix = interaction.content.match(mentionRegPrefix) ? interaction.content.match(mentionRegPrefix)[0] : botPrefix;
    
            if (!interaction.content.startsWith(prefix)) return;

            const args = interaction.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift()?.toLowerCase();
            const command = kaizo.commands.get(cmd.toLowerCase()) || kaizo.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));

            if (!command) return;

            if (command) {
                // --------------------- Dành cho owner bot -------------------- //
                if (command.mode.developerOnly && interaction.author.id !== kaizo.config.settings.developer) {
                    return await interaction.send('This command is limited to bot developers only !')
                }
                // --------------------- Dành cho owner guild -------------------- //
                if (command.mode.ownerGuildOnly && interaction.author.id !== interaction.guild.ownerId) {
                    return await interaction.send('This command is limited to owner guild only !')
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
                    if (!interaction.member.permissions.has(PermissionsBitField.resolve(command.permissions.author || []))) {
                        return interaction.send(`Looks like you're missing the following permission: \`${command.permissions.author || []}\``)
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

                if (interaction.author.id !== kaizo.config.settings.developer) {
                    if (command.cooldown) {
                        if (timecooldowns.has(interaction.author.id)) {
                            const expTime = timecooldowns.get(interaction.author.id) + (command.cooldown * 1000)
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

                        timecooldowns.set(interaction.author.id, Date.now())
                        setTimeout(() => {
                            timecooldowns.delete(interaction.author.id)
                        }, command.cooldown * 1000)
                    }
                };

                command.run(kaizo, interaction, args, timecooldowns, prefix);
            }
        } catch (e) {
            kaizo.logger.error(e);
        }
    }
}