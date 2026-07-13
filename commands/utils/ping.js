const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    	await interaction.editReply(`:ping_pong: Pong!
    	Bot Latency: ${interaction.client.ws.ping}ms.
    	Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  
	},
};