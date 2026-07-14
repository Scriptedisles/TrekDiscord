const { SlashCommandBuilder } = require('discord.js');
const { session, run } = require('../../trek.js');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('stoptrek')
		.setDescription('Stops the Trek server'),

	async execute(interaction) {
        interaction.deferReply();

        if (interaction.user.id !== session.userId) {
            return interaction.reply({  
                content: "You are not the owner of this Trek session.",
                ephemeral: true
            });
        }
        else {
            if (!session.running) {
                return interaction.reply({  
                    content: "No active Trek session to stop.",
                    ephemeral: true
                });
            }
            else {
                await interaction.reply({
                    content: "Stopping Trek session...",
                    ephemeral: true
                });  
            } 
        }
    }
};