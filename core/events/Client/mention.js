module.exports = {
    name: 'messageCreate',
    async run(kaizo, interaction) {
        try {
            if (!interaction.guild || interaction.author.bot) return;

            if (interaction.content.includes("@here") || interaction.content.includes("@everyone") || interaction.type == "REPLY") return;

            if (interaction.content.match(new RegExp(`^<@!?${kaizo.user.id}>( |)$`))) {

                    const mentionRegPrefix = new RegExp(`^<@!?${kaizo.user.id}>`);

                    let botPrefix = kaizo.config.bot.prefix;
                    const prefix = interaction.content.match(mentionRegPrefix) ? interaction.content.match(mentionRegPrefix)[0] : botPrefix;
            
                    if (!interaction.content.startsWith(prefix)) return;

                    return await interaction.reply({
                        embeds: [kaizo.embeds.embedEditor(kaizo, interaction, `・Hi I'm **${kaizo.user.username}** !\n・My prefix : \`${botPrefix}\` or ${prefix}, you can also use a slash [\`/\`]\n・Vote me? [Vote In Here](${kaizo.config.settings.topGG})\n・Languages : :flag_us: (Update soon :flag_vn:)`, true, `${interaction.author.username} Need help?`, false, false)],
                        components: [kaizo.buttons.buttonLink(kaizo)]
                    
                    });
            }
        } catch (e) {
            console.log(e);
        }
    }
}