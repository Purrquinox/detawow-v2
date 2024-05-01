import { SlashCommandBuilder } from "@discordjs/builders";
import {
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("invoice")
		.setDescription("Create invoice")
		.addUserOption((s) =>
			s
				.setName("user")
				.setDescription("Which user are you trying to hunt down?")
				.setRequired(true)
		)
		.addNumberOption((s) =>
			s
				.setName("amount")
				.setDescription("How much money are you requesting (USD)")
				.setRequired(true)
		),
	async execute(client, interaction, EmbedPorn, codeBlock, db) {
		const user = interaction.options.getUser("user");
		const amount = interaction.options.getNumber("amount");

		const embed = new EmbedBuilder()
			.setTitle("Invoice Creation Notice")
			.setColor("Red")
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL(),
				url: interaction.user.displayAvatarURL(),
			})
			.setDescription(
				`Hmm. It looks like <@${user.id}> owes you $${String(amount)} USD. I have him in my target, should i take the shot? Please note that this action cannot be reversed.`
			)
			.setFooter({
				iconURL: interaction.user.displayAvatarURL(),
				text: `i am slowly dying inside, please fucking help me.`,
			});

		const Confirm = new ButtonBuilder()
			.setLabel("Yes")
			.setStyle(ButtonStyle.Danger)
			.setCustomId("confirm");

		const Deny = new ButtonBuilder()
			.setLabel("No")
			.setStyle(ButtonStyle.Secondary)
			.setCustomId("deny");

		const components = new ActionRowBuilder().addComponents(Confirm, Deny);

		const resp = await interaction.reply({
			embeds: [embed],
			components: [components],
		});

		const filter = (i) => {
			if (i.customId === "confirm") return true;
			if (i.customId === "deny") return true;
			else return false;
		};

		const btn = await resp.createMessageComponentCollector({
			filter,
			time: 120000,
		});

		btn.on("collect", async (i) => {
			if (i.customId === "confirm") {
				resp.edit({
					content:
						"Okay!\n*shoots*\nThat bitch ass didn't stand a chance!",
                    embeds: [],
                    components: []
				});

                user.send({
					content: `Oh, hey there. My boss, ${interaction.user.username} is getting a little impatient. Hurry and pay him the $${amount} USD. Don't worry, we might give you another reminder.`,
				});
			} else if (i.customId === "deny") {
				resp.edit({
					content:
						"Oh, okay! We want to play nice today. I have given him a not so friendly reminder about your payment! Let me take the shot next time though!",
                    embeds: [],
                    components: []
				});

				user.send({
					content: `Oh, hey there. My boss, ${interaction.user.username} is getting a little impatient. Hurry and pay him the $${amount} USD. Don't worry, we might give you another reminder.`,
				});
			}
		});

		btn.on("end", (_, reason) => {
			if (reason !== "messageDelete") {
				resp.edit({
					content:
						"This interaction has expired. Please reexecute the command to complete this action.",
					embeds: [],
					components: [],
				});
			}
		});
	},
};
