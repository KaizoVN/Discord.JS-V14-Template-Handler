
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

module.exports = async (kaizo) => {
    try {
        let eventDir = await readdir("./core/events/");
        eventDir.forEach(dir => {
            const eventFile = fs.readdirSync('./core/events/' + dir + "/").filter(file => file.endsWith('.js'));
        
            for (const file of eventFile) {
                const event = require(`${process.cwd()}/core/events/${dir}/${file}`);

                if (!event.name) {
                    return kaizo.logger.error(`An unexpected error occured with EVENT ${file}.`);
                }

                if (event.once) {
                    kaizo.once(event.name, (...args) => event.run(kaizo, ...args));
                } else {
                    kaizo.on(event.name, (...args) => event.run(kaizo, ...args));
                }
            }
            
        })

        await kaizo.logger.ready(`Launched Events !`);
    } catch (err) {
        kaizo.logger.error(err);
    }
};