// Packages
import {
	Client,
	codeBlock,
	GatewayIntentBits,
	InteractionType,
	EmbedBuilder,
	SlashCommandBuilder,
	ActivityType,
} from "discord.js";
import fs from "node:fs";
import db from "./database/mongo.js";
import * as logger from "./logger.js";
import * as dotenv from "dotenv";
import * as path from "path";

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
