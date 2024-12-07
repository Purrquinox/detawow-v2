import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("haerin")
		.setDescription("yes."),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		await interaction.reply({
			files: [{
				attachment: "https://c.tenor.com/AhO27JOKpBAAAAAC/tenor.gif",
				name: "Haerin"
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
