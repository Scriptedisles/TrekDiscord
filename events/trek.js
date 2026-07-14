const { Events, MessageFlags, Collector } = require('discord.js');
const { session, run, shutdown } = require('../trek.js');
const { log } = require('../logs/logging.js');
const { exec } = require("child_process");


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

	if (interaction.isChatInputCommand()) {

			if (interaction.commandName === "starttrek") {

				if (session.running) {
					return interaction.reply({
						content: "A Trek session is already running.",
						ephemeral: true
					});
				}

				await interaction.reply({
					content: "Starting Trek session...",
					ephemeral: true
				});

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

					await user.send({
						content:
							"Your Trek session has been running for 1 hour.\nWould you like to continue or shut it down?\nIf you do nothing it will shut down in 5 minutes.",
						components: [row]
					});

					session.shutdownTimeout = setTimeout(async () => {
						await shutdown();
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

					await interaction.user.send({
						content:
							"Another hour has passed.\nContinue or shut down?\nAutomatic shutdown in 5 minutes.",
						components: [row]
					});

					session.shutdownTimeout = setTimeout(async () => {
						await shutdown();
					}, 5 * 60 * 1000);

				}, 60 * 60 * 1000);

				return interaction.update({
					content: "Session extended for another hour.",
					components: []
				});
				
				if (interaction.customId === "shutdown") {

				await shutdown();

				return interaction.update({
					content: "Session has been shut down.",
					components: []
				});
				}


			}
			}
		},
}