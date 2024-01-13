import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setName("bash")
		.setDescription("Run bash commands inside of a container!"),
	async execute(client, interaction, EmbedBuilder, codeBlock, db) {
		let modal;
		const admins = client.admins;

		if (admins.includes(interaction.user.id)) {
			modal = new ModalBuilder()
				.setCustomId("shell-private")
				.setTitle("Shell (Admin)");

			const command = new TextInputBuilder()
				.setCustomId("command")
				.setLabel("Command")
				.setStyle(TextInputStyle.Paragraph)
				.setMinLength(1)
				.setPlaceholder("Command to execute...")
				.setRequired(true);

			const inline = new TextInputBuilder()
				.setCustomId("inline")
				.setLabel("Do you want the embed to be inlined?")
				.setStyle(TextInputStyle.Short)
				.setMaxLength(1)
				.setPlaceholder("Y/N [Default: N]")
				.setRequired(false);

			const hidden = new TextInputBuilder()
				.setCustomId("hidden")
				.setLabel("Hidden?")
				.setStyle(TextInputStyle.Short)
				.setMaxLength(1)
				.setPlaceholder("Y/N [Default: N]")
				.setRequired(false);

			modal.addComponents([
				new ActionRowBuilder().addComponents(command),
				new ActionRowBuilder().addComponents(inline),
				new ActionRowBuilder().addComponents(hidden),
			]);
		} else {
			modal = new ModalBuilder()
				.setCustomId("shell-public")
				.setTitle("Shell (Public)");

			const command = new TextInputBuilder()
				.setCustomId("command")
				.setLabel("Command")
				.setStyle(TextInputStyle.Paragraph)
				.setMinLength(5)
				.setPlaceholder("Command to execute...")
				.setRequired(true);

			const inline = new TextInputBuilder()
				.setCustomId("inline")
				.setLabel("Do you want the embed to be inlined?")
				.setStyle(TextInputStyle.Short)
				.setMaxLength(1)
				.setPlaceholder("Y/N [Default: N]")
				.setRequired(false);

			const hidden = new TextInputBuilder()
				.setCustomId("hidden")
				.setLabel("Do you want the results to be private?")
				.setStyle(TextInputStyle.Short)
				.setMaxLength(1)
				.setPlaceholder("Y/N [Default: N]")
				.setRequired(false);

			modal.addComponents([
				new ActionRowBuilder().addComponents(command),
				new ActionRowBuilder().addComponents(inline),
				new ActionRowBuilder().addComponents(hidden),
			]);
		}

		interaction.showModal(modal, {
			client: client,
			interaction: interaction,
		});
	},
};
