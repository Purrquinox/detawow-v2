import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("haerin")
		.setDescription("yes."),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		await interaction.reply({
			files: [{
				attachment: "https://media.tenor.com/AhO27JOKpBAAAAPo/haerin-newjeans.mp4",
				name: "haerin-newjeans.mp4"
			}],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "Haerin",
							style: 4,
							custom_id: "unknown",
							disabled: true,
						},
					],
				},
			],
		});
	},
};
