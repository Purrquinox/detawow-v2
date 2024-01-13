import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("How long have i been alive for?"),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		const formatTime = (seconds) => {
			const days = Math.floor(seconds / 86400);
			seconds -= days * 86400;

			const hours = Math.floor(seconds / (60 * 60));
			seconds -= hours * 3600;

			const minutes = Math.floor((seconds % (60 * 60)) / 60);
			seconds -= minutes * 60;

			const secs = Math.floor(seconds % 60);

			return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
		};

		await interaction.reply({
			content: formatTime(process.uptime()),
		});
	},
};
