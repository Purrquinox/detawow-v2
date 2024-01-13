import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("urban")
		.setDescription("Search for Urban Dictionary definitions.")
		.setNSFW(true)
		.addStringOption((option) =>
			option
				.setName("query")
				.setDescription("What do you want to search for?")
				.setRequired(true)
		),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		const query = interaction.options.getString("query");

		if (!interaction.channel.nsfw)
			return interaction.reply(
				"This command can only be used in NSFW channels!"
			);

		let results = await fetch(
			`https://api.urbandictionary.com/v0/define?term=${query}`
		).then(async (res) => await res.json());

		if (results.error) {
			let embed = new EmbedBuilder()
				.setTitle("brain damage")
				.setColor(0xff0000)
				.addFields({
					name: "Message",
					value: codeBlock("javascript", results.error),
					inline: false,
				});

			await interaction.reply({
				embeds: [embed],
			});
		} else if (!results.list.length)
			return interaction.reply(`No results found for **${query}**.`);
		else {
			results = results.list;

			let embed = new EmbedBuilder()
				.setTitle(results[0].word)
				.setURL(results[0].permalink)
				.setColor(0x00ff00)
				.addFields({
					name: "Definition",
					value: results[0].definition,
					inline: false,
				})
				.addFields({
					name: "Ratings",
					value: `Upvotes: ${results[0].thumbs_up} | Downvotes: ${results[0].thumbs_down}`,
					inline: false,
				});

			await interaction.reply({
				embeds: [embed],
			});
		}
	},
};
