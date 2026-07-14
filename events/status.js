const { Events, MessageFlags, Collector, ActivityType } = require('discord.js');



module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setActivity({ name: 'Putting Minors Back to Work', type: ActivityType.Streaming, url: 'https://twitch.tv/puttingminorsbacktowork' });
    }   
};