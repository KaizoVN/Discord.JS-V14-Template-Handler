const { 
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ["p"],
    description: 'Get the time between the bot and discord in milliseconds',
    cooldown : 5,
    permissions : {
        bot : '',
        user : '',
    },
    mode: {
        developerOnly : false,
        ownerGuildOnly : false,
        toggleOff: false,
        verified : false,
    },
    category: "Ultility",
    example: ["ping"],

    async run(kaizo, interaction, args, prefix) {
        const wsPing = kaizo.ws.ping;

        const upTime = kaizo.utils.msToTime(kaizo.uptime);

        const pingemb = new EmbedBuilder()
        .setAuthor({ name: "Ping", iconURL: `${interaction.author.displayAvatarURL()}`  })
        .setColor(kaizo.config.embed.success)
        .addFields(
            { name: "Bot Latency", value: `${wsPing}ms`, inline: true },
            { name: "Bot Uptime", value: `${upTime}`, inline: false }
        )
        .setFooter({ text: kaizo.config.embed.footer })
        .setTimestamp();

        return interaction.reply({
            embeds: [pingemb]
        });
    }
}