import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("bruh")
		.setDescription("i hate my life..."),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		await interaction.reply({
			content: client.user.displayAvatarURL(),
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							label: "BRUH",
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
