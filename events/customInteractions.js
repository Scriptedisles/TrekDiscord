const { Events, MessageFlags, Collector, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setUserData, updateUser } = require('../database_func');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		
        if (interaction.customId === 'confirmUserID') {
		   
			
    	}
    	
		
	},
};