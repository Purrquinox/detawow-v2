import { SlashCommandBuilder } from "@discordjs/builders";
import { exec } from "child_process";

export default {
	data: {
		name: "shell-private",
	},
	async execute(client, interaction, EmbedBuilder, codeBlock) {
		const command = interaction.fields.getTextInputValue("command");
		let inline = interaction.fields.getTextInputValue("inline") || "n";
		let hidden = interaction.fields.getTextInputValue("hidden") || "n";
		let embed;

		if (inline.toLowerCase() === "y") inline = true;
		else inline = false;

		const limit = (value) => {
			let max_chars = 700;
			let i;

			if (value.length > max_chars) i = value.substr(0, max_chars);
			else i = value;

			return i;
		};

		const clean = async (text) => {
			if (text && text.constructor.name == "Promise") text = await text;

			if (typeof text !== "string")
				text = require("util").inspect(text, {
					depth: 1,
				});

			text = text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203));

			return text;
		};

		try {
			exec(command, async (err, stdout, stderr) => {
				const results = await clean(stdout);

				if (err) {
					embed = new EmbedBuilder()
						.setTitle("Bash Results")
						.setColor(0xff0000)
						.addFields(
							{
								name: "Input:",
								value: codeBlock("bash", limit(command)),
								inline: inline,
							},
							{
								name: "Output:",
								value: codeBlock("bash", limit(err)),
								inline: inline,
							}
						)
						.setFooter({
							iconURL: interaction.user.displayAvatarURL(),
							text: `Executed by ${
								interaction.user.username
							}, in about ${Math.floor(
								Date.now() - interaction.createdAt
							)} milliseconds`,
						});

					if (hidden.toLowerCase() === "y") {
						await interaction.deferReply({
							ephemeral: true,
						});
						await interaction.followUp({
							embeds: [embed],
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							embeds: [embed],
						});
					}
				} else {
					embed = new EmbedBuilder()
						.setTitle("Bash Results")
						.setColor(0x00ff00)
						.addFields(
							{
								name: "Input:",
								value: codeBlock("bash", limit(command)),
								inline: inline,
							},
							{
								name: "Results:",
								value: codeBlock("bash", limit(results)),
								inline: inline,
							}
						)
						.setFooter({
							iconURL: interaction.user.displayAvatarURL(),
							text: `Executed by ${
								interaction.user.username
							}, in about ${Math.floor(
								Date.now() - interaction.createdAt
							)} milliseconds`,
						});

					if (hidden.toLowerCase() === "y") {
						await interaction.deferReply({
							ephemeral: true,
						});
						await interaction.followUp({
							embeds: [embed],
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							embeds: [embed],
						});
					}
				}
			});
		} catch (err) {
			embed = new EmbedBuilder()
				.setTitle("Bash Results")
				.setColor(0xff0000)
				.addFields(
					{
						name: "Input:",
						value: codeBlock("bash", limit(command)),
						inline: inline,
					},
					{
						name: "Output:",
						value: codeBlock("bash", limit(err)),
						inline: inline,
					}
				)
				.setFooter({
					iconURL: interaction.user.displayAvatarURL(),
					text: `Executed by ${
						interaction.user.username
					}, in about ${Math.floor(
						Date.now() - interaction.createdAt
					)} milliseconds`,
				});

			if (hidden.toLowerCase() === "y") {
				await interaction.deferReply({
					ephemeral: true,
				});
				await interaction.followUp({
					embeds: [embed],
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					embeds: [embed],
				});
			}
		}
	},
};
