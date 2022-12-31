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

                    return await interaction.send(`Hi! My prefix is ${prefix}.`)
            }
        } catch (e) {
            console.log(e);
        }
    }
}