const { Events, MessageFlags, Collector, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, userMention } = require('discord.js');
const { session, run } = require('../trek.js');
const { log } = require('../logs/logging.js');
const { exec } = require("child_process");

async function shutdown() {
    
	try {

        session.running = false;

        clearTimeout(session.timeout);
        clearTimeout(session.shutdownTimeout);

        try {
            await run("pm2 stop tunnel");
        } catch (e) {
			log(e, "event");
		}

        try {
            await run("docker stop trek");
        } catch (e) {
			log(e, "event");
		}

	}
	catch (e) {
		log(e, "event");
	}
}
      

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

	let client = interaction.client
	let trekChannel = client.channels.cache.get("1526399712494620733")

	if (interaction.isChatInputCommand()) {

			if (interaction.commandName === "starttrek") {

				
				if (session.running) {
					return interaction.reply({
						content: "A Trek session is already running.",
						ephemeral: true
					});
				}

				await interaction.reply({
					content: "Starting Trek session... trek is accessable at <http://travel.breezeified.xyz>",
					ephemeral: true
				});

				const embed = new EmbedBuilder()
					.setColor(0x034428)
					.setTitle('Trek Session Started')
					.setDescription(`A Trek session has been started by ${userMention(interaction.user.id)}.`)
					.setTimestamp()
					.setURL('http://travel.breezeified.xyz');
				
				trekChannel.send({ embeds: [embed] });

				session.running = true;
				session.userId = interaction.user.id;

				try {
					await run("pm2 start tunnel");
					await run("docker start trek");
				} catch (e) {
					session.running = false;

					log(e, "command")

					return interaction.followUp({
						content: "Failed to start Trek session.",
						ephemeral: true
					});

				}

				session.timeout = setTimeout(async () => {

					if (!session.running) return;

					const user = await client.users.fetch(session.userId);

					const row = new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("continue")
							.setLabel("Continue")
							.setStyle(ButtonStyle.Success),

						new ButtonBuilder()
							.setCustomId("shutdown")
							.setLabel("Shutdown")
							.setStyle(ButtonStyle.Danger)
					);

					const newEmbed = new EmbedBuilder()
						.setColor(0x286BD7)
						.setTitle('Trek Session')
						.setDescription(`Your Session has been running for 1 hour. Would you like to continue or shut it down? If you do nothing it will shut down in 5 minutes.`)
						.setTimestamp();

					await user.send({
						embeds: [newEmbed],
						components: [row]
					});

					session.shutdownTimeout = setTimeout(async () => {
						await shutdown();
						
						const embed = new EmbedBuilder()
						.setColor(0xFF9901)
						.setTitle('Trek Session Timedout')
						.setDescription(`A Trek session has timed out.`)
						.setTimestamp();
					
						trekChannel.send({ embeds: [embed] });

					}, 5 * 60 * 1000);

				}, 60 * 60 * 1000);
			}

		}

		if (interaction.isButton()) {

			if (!session.running) {
				return interaction.reply({
					content: "There is no active session.",
					ephemeral: true
				});
			}

			if (interaction.user.id !== session.userId) {
				return interaction.reply({
					content: "Only the user who started the session can use these buttons.",
					ephemeral: true
				});
			}

			if (interaction.customId === "continue") {

				clearTimeout(session.shutdownTimeout);

				session.timeout = setTimeout(async () => {

					const row = new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("continue")
							.setLabel("Continue")
							.setStyle(ButtonStyle.Success),

						new ButtonBuilder()
							.setCustomId("shutdown")
							.setLabel("Shutdown")
							.setStyle(ButtonStyle.Danger)
					);

					const newEmbed = new EmbedBuilder()
						.setColor(0x286BD7)
						.setTitle('Trek Session')
						.setDescription(`Your Session has been running for 1 hour. Would you like to continue or shut it down? If you do nothing it will shut down in 5 minutes.`)
						.setTimestamp();

					await interaction.user.send({
						embeds: [newEmbed],
						components: [row]
					});
					const embed = new EmbedBuilder()
						.setColor(0xFF9901)
						.setTitle('Trek Session Timedout')
						.setDescription(`A Trek session has timed out.`)
						.setTimestamp();
					
					

					session.shutdownTimeout = setTimeout(async () => {
						await shutdown();
						trekChannel.send({ embeds: [embed] });
					}, 5 * 60 * 1000);

					

				}, 60 * 60 * 1000);
 

					return interaction.update({
						content: "Session extended for another hour.",
						components: []
					});
			
			}		
				
			if (interaction.customId === "shutdown") {

					await interaction.deferUpdate();

					await shutdown();

					const embed = new EmbedBuilder()
					.setColor(0x750C00)
					.setTitle('Trek Session Stopped')
					.setDescription(`A Trek session has been stopped by ${userMention(interaction.user.id)}.`)
					.setTimestamp();
				
					trekChannel.send({ embeds: [embed] });

					
					await interaction.editReply({
							content: "Session has been shut down.",
							embeds: [],
							components: [],
							flags: MessageFlags.Ephemeral
					});
			}	

		}
			
	},
}