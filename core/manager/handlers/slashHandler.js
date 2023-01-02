
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

module.exports = async (kaizo) => {
    try {
        const slashArr = [];

        let slashDir = await readdir("./commands/slash/");
        slashDir.forEach(async(dir) => {
            const slashFile = fs.readdirSync('./commands/slash/' + dir + "/").filter(file => file.endsWith('.js'));
        
            for (const file of slashFile) {
                const cmd = require(`${process.cwd()}/commands/slash/${dir}/${file}`);

                if (!cmd.name) {
                    return kaizo.logger.error(`An unexpected error occured with SLASH COMMANDS ${file}.`);
                }

                slashArr.push({
                    name: cmd.name,
                    description: cmd.description,
                    cooldown: cmd.cooldown,
                    permissions: {
                        bot : cmd.permissions.bot ? PermissionsBitField.resolve(cmd.permissions.bot).toString() : null,
                        user : cmd.permissions.user ? PermissionsBitField.resolve(cmd.permissions.user).toString() : null,
                    },
                    mode: {
                        developerOnly : cmd.mode.developerOnly,
                        ownerGuildOnly : cmd.mode.ownerGuildOnly
                    },
                    category: cmd.category,
                    example: cmd.example,
                    options: cmd.options ? cmd.options : null,
                });

                kaizo.slashcommands.set(cmd.name, cmd);

            }
            
        })

        await kaizo.logger.ready(`Launched Slash Commands !`);

        kaizo.on('ready', async () => {       
            return await kaizo.application.commands.set(slashArr);
        })
    } catch (err) {
        kaizo.logger.error(err);
    }
};