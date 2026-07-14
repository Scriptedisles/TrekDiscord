const { SlashCommandBuilder } = require('discord.js');


module.exports = {

	data: new SlashCommandBuilder()
		.setName('starttrek')
		.setDescription('Starts the Trek server for 1hr'),

	async execute(interaction) {
        if (interaction.client.session.running) {
            return interaction.reply({  
                content: "Working",
                ephemeral: true
            });
        }   
    }
};