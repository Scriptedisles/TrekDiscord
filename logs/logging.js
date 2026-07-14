const fs = require('fs');
const path = require('path');
const commandsError = path.join(__dirname, 'commanderrors');
const eventsError = path.join(__dirname, 'eventerrors');


module.exports = {

    async log(message, type) {

        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}ERROR] ${message}`;

        if (type === 'command') {
            var errorfile = path.join(commandsError, `CommandError-${new Date().toISOString().split('T')[0]}.log`);
            fs.writeFileSync(errorfile, logMessage + '\n', { flag: 'a' });

            const fileName = await path.basename(errorfile);
            return { timestamp, fileName };
        }
        else if (type === 'event') {
            var errorfile = path.join(eventsError, `EventError-${new Date().toISOString().split('T')[0]}.log`);
            fs.writeFileSync(errorfile, logMessage + '\n', { flag: 'a' });

            const fileName = await path.basename(errorfile);

            return { timestamp, fileName };

        }
        
    }

} 