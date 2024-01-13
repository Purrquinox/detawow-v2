import { SlashCommandBuilder } from "@discordjs/builders";
import { PermissionsBitField, ChannelType } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("markov")
		.setDescription("Talk with me, in a channel!")
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel you want me to chat in")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("category")
				.setDescription(
					"What type of response would you like to receive?"
				)
				.setRequired(true)
				.addChoices(
					{ name: "Brain Damage", value: "brain_damage" },
					{ name: "Failure", value: "failure" }
				)
		),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		const channel = interaction.options.getChannel("channel");
		const category = interaction.options.getString("category");

		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Flags.ManageChannels
			)
		)
			return interaction.reply(
				"You do not have permission to use this command!"
			);

		if (category.endsWith("nsfw")) {
			if (!channel.nsfw)
				return interaction.reply(
					"This category can only be used in NSFW channels!"
				);
			else if (channel.nsfw) {
				db.aiChannels.add(channel.id, interaction.guild.id, category);

				interaction.reply({
					content: `You can now talk with me in the <#${channel.id}> channel!`,
				});
			}
		} else {
			db.aiChannels.add(channel.id, interaction.guild.id, category);

			interaction.reply({
				content: `You can now talk with me in the <#${channel.id}> channel!`,
			});
		}
	},
};
