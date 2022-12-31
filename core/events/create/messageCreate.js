module.exports = {
	name: "messageCreate",

	async run(kaizo, interaction) {
        try {

            if (!interaction.guild || interaction.author.bot) return;

            if (interaction.channel.partial) await interaction.channel.fetch();
            if (interaction.partial) await interaction.fetch();
            await interaction.guild.members.fetch({ force: true })

            const mentionRegPrefix = new RegExp(`^<@!?${kaizo.user.id}>`);
    
            // if (!userPrefix[0]) botPrefix = kaizo.config.bot.prefix
            // else botPrefix = userPrefix[0].guild_prefix;
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
                    return await interaction.reply({
                        embeds: [kaizo.embeds.embedEditor(kaizo, interaction, `This command is limited to bot developers only !`, false, false, false, false)]
                    });
                }
                // --------------------- Dành cho owner guild -------------------- //
                if (command.mode.ownerGuildOnly && interaction.author.id !== interaction.guild.ownerId) {
                    return await interaction.reply({
                        embeds: [kaizo.embeds.embedEditor(kaizo, interaction, `This command is limited to owner guild only !`, false, false, false, false)]
                    });
                }

                command.run(kaizo, interaction, args, prefix);
            }
        } catch (e) {
            kaizo.logger.error(e);
        }
    }
}