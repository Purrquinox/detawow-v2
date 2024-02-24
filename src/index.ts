// Packages
import {
	Client,
	codeBlock,
	GatewayIntentBits,
	InteractionType,
	EmbedBuilder,
	SlashCommandBuilder,
	ActivityType,
	ChannelType,
} from "discord.js";
import fs from "node:fs";
import markov from "markov";
const chain = markov(1);
import db from "./database/mongo.js";
import * as logger from "./logger.js";
import * as dotenv from "dotenv";
import * as path from "path";
import data from "./data.js";

// Configure dotenv
dotenv.config();

// Initalize Discord Client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

// Banned Users
const bannedUsers: string[] = [];

// Ready Event
client.on("ready", () => {
	logger.info("Discord", `Logged in as ${client?.user?.tag}!`);

	// Set Activity
	client?.user?.setActivity(`brain damage`, {
		type: ActivityType.Watching,
	});
});

// Debug Event
client.on("debug", (info) => {
	logger.debug("Discord", info);
});

// Error Event
client.on("error", (error) => {
	logger.error("Discord", error.toString());
});

// AI Chat Event
const ratelimit: Map<string, number> = new Map();

client.on("messageCreate", async (message) => {
	// Block Message
	if (message.author.bot) return;
	if (message.channel.type === ChannelType.DM) return;
	if (process.env.NODE_ENV === "canary") return;

	// Block message if channel is not in the database
	let data = await db.aiChannels.get(message.channel.id);
	if (!data) return;

	// Block message if user is under the ratelimit
	if (ratelimit.get(message.author.id)) return;

	// Banned Users
	if (bannedUsers.includes(message.author.id)) return;

	// Ratelimit
	const userData = await db.users.get(message.author.id);

	if (userData) {
		if (userData?.ratelimit === 0) return;
		ratelimit.set(
			message.author.id,
			(userData?.ratelimit || 1) * 60 * 1000
		);
	} else ratelimit.set(message.author.id, 2 * 60 * 1000);

	// Chain File
	const file = fs.createReadStream(__dirname + `/${data.category}.txt`);

	// Ask chain for response to user message and send
	chain.seed(file, async () => {
		message.channel.sendTyping();

		setTimeout(() => {
			const response = chain.respond(message.content);
			message.reply(response.join(" "));
		}, 2000);
	});

	// Remove user from ratelimit
	setTimeout(
		() => {
			ratelimit.delete(message.author.id);
		},
		(userData?.ratelimit || 1) != 0 ? 0 : ratelimit.get(message.author.id)
	);
});

// Get files from directory
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

// Add Commands
const commands: Map<
	string,
	{
		data: SlashCommandBuilder;
		execute: (
			client,
			interaction,
			EmbedBuilder,
			codeBlock,
			db
		) => Promise<void>;
	}
> = new Map();
const commandFiles = getFilesInDirectory("./dist/commands").filter((file) =>
	file.endsWith(".js")
);

for (const file of commandFiles) {
	import(`../${file}`)
		.then((module) => {
			const i = module.default;
			commands.set(i.data.name, i);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Add Modals
const modals: Map<
	string,
	{
		data: {
			name: string;
		};
		execute: (
			client,
			interaction,
			EmbedBuilder,
			codeBlock,
			db
		) => Promise<void>;
	}
> = new Map();
const modalFiles = getFilesInDirectory("./dist/modals").filter((file) =>
	file.endsWith(".js")
);

for (const file of modalFiles) {
	import(`../${file}`)
		.then((module) => {
			const i = module.default;
			modals.set(i.data.name, i);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Add Buttons
const buttons: Map<
	string,
	{
		data: {
			name: string;
		};
		execute: (
			client,
			interaction,
			EmbedBuilder,
			codeBlock,
			db
		) => Promise<void>;
	}
> = new Map();
const buttonFiles = getFilesInDirectory("./dist/buttons").filter((file) =>
	file.endsWith(".js")
);

for (const file of buttonFiles) {
	import(`../${file}`)
		.then((module) => {
			const i = module.default;
			buttons.set(i.data.name, i);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// Interaction Event(s)
client.on("interactionCreate", async (interaction) => {
	// Block banned users
	if (bannedUsers.includes(interaction.user.id)) return;

	// Slash Command
	if (interaction.isChatInputCommand()) {
		const command = commands.get(interaction.commandName);

		if (command) {
			try {
				await command.execute(
					client,
					interaction,
					EmbedBuilder,
					codeBlock,
					db
				);
			} catch (error) {
				console.error(error);

				let embed = new EmbedBuilder()
					.setTitle("brain damage")
					.setColor(0xff0000)
					.addFields({
						name: "Message",
						value: codeBlock("javascript", error),
						inline: false,
					});

				await interaction.reply({
					embeds: [embed],
				});
			}
		} else {
			await interaction.reply("This command does not exist.");
		}
	}

	// Button
	if (interaction.isButton()) {
		const button = buttons.get(interaction.customId);
		const command = commands.get(interaction.customId);

		if (button) {
			try {
				await button.execute(
					client,
					interaction,
					EmbedBuilder,
					codeBlock,
					db
				);
			} catch (error) {
				console.error(error);

				let embed = new EmbedBuilder()
					.setTitle("brain damage")
					.setColor(0xff0000)
					.addFields({
						name: "Message",
						value: codeBlock("javascript", error),
						inline: false,
					});

				await interaction.reply({
					embeds: [embed],
				});
			}
		} else {
			// Check if button is equal to a slash command
			if (command) {
				try {
					await command.execute(
						client,
						interaction,
						EmbedBuilder,
						codeBlock,
						db
					);
				} catch (error) {
					console.error(error);

					let embed = new EmbedBuilder()
						.setTitle("brain damage")
						.setColor(0xff0000)
						.addFields({
							name: "Message",
							value: codeBlock("javascript", error),
							inline: false,
						});

					await interaction.reply({
						embeds: [embed],
					});
				}
			} else {
				// button does not equal to anything
				await interaction.reply(
					"This button does not have any functionality."
				);
			}
		}
	}

	// Modal
	if (interaction.type === InteractionType.ModalSubmit) {
		// Block banned users
		if (bannedUsers.includes(interaction.user.id)) return;

		const modal = modals.get(interaction.customId);

		if (!modal) {
			let embed = new EmbedBuilder()
				.setTitle("Error")
				.setColor(0xff0000)
				.setDescription("Command does not exist!");

			await interaction.reply({
				embeds: [embed],
			});
		}

		try {
			await modal?.execute(
				client,
				interaction,
				EmbedBuilder,
				codeBlock,
				db
			);
		} catch (error) {
			let embed = new EmbedBuilder()
				.setTitle("brain damage")
				.setColor(0xff0000)
				.addFields({
					name: "Message",
					value: codeBlock("javascript", error),
					inline: false,
				});

			await interaction.reply({
				embeds: [embed],
			});
		}
	}
});

// Login to Discord
client.login(process.env.TOKEN);
