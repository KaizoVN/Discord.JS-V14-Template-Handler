module.exports = {
    name: "ready",
    once: true,

    async run(kaizo) {
        try {
            kaizo.logger.log(`Cleaning up cooldowns collection...`);   
            kaizo.logger.ready(`${kaizo.user.username} is now online !`);

            let botPrefix = kaizo.config.bot.prefix;

            kaizo.user.setStatus(kaizo.config.presence.status);
            kaizo.user.setActivity(`New Version | Shard #${kaizo.shard?.ids[0] + 1}`)
        } catch (e) {
            console.log(e)
        }
    }
}