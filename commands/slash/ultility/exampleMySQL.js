const { 
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'example',
    aliases: ["exam"],
    description: 'Example',
    cooldown : 5,
    permissions : {
        bot : '',
        user : '',
    },
    mode: {
        developerOnly : false,
        ownerGuildOnly : false,
    },
    category: "Ultility",
    example: ["ping"],
    options: [],

    async run(kaizo, interaction, args, timecooldown) {
        // time cooldown delete
        await timeCooldowns.delete(interaction.user.id) //remove cd commands

        // mysql select, insert, delete
        const test_id = 1

        await kaizo.mysql.query(`SELECT * FROM test_table WHERE id='${test_id}'`, async (err, i) => {
            if (err) return kaizo.logger.err(err);

            await kaizo.mysql.query(`INSERT INTO test_table(id, name) VALUES (?, ?)`, [`${test_id}`, `KaizoVN`])

            await kaizo.mysql.query(`DELETE FROM test_table WHERE id='${test_id}'`)
        })
    }
}