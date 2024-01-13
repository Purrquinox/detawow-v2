var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Packages
import { Client, codeBlock, GatewayIntentBits, InteractionType, EmbedBuilder, ActivityType, ChannelType, } from "discord.js";
import fs from "node:fs";
import markov from "markov";
const chain = markov(1);
import db from "./database/mongo.js";
import logger from "./logger.js";
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
const bannedUsers = [];
// Ready Event
client.on("ready", () => {
    var _a, _b;
    logger.info("Discord", `Logged in as ${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    // Set Activity
    (_b = client === null || client === void 0 ? void 0 : client.user) === null || _b === void 0 ? void 0 : _b.setActivity(`brain damage`, {
        type: ActivityType.Watching,
    });
});
// Debug Event
client.on("debug", (info) => {
    logger.debug("Discord", info);
});
// Error Event
client.on("error", (error) => {
    logger.error("Discord", error);
});
// AI Chat Event
const ratelimit = new Map();
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    // Block Message
    if (message.author.bot)
        return;
    if (message.channel.type === ChannelType.DM)
        return;
    if (process.env.NODE_ENV === "canary")
        return;
    // Block message if channel is not in the database
    let data = yield db.aiChannels.get(message.channel.id);
    if (!data)
        return;
    // Block message if user is under the ratelimit
    if (ratelimit.get(message.author.id))
        return;
    // Banned Users
    if (bannedUsers.includes(message.author.id))
        return;
    // Ratelimit
    const userData = yield db.users.get(message.author.id);
    if (userData) {
        if ((userData === null || userData === void 0 ? void 0 : userData.ratelimit) === 0)
            return;
        ratelimit.set(message.author.id, ((userData === null || userData === void 0 ? void 0 : userData.ratelimit) || 1) * 60 * 1000);
    }
    else
        ratelimit.set(message.author.id, 2 * 60 * 1000);
    // Chain File
    const file = fs.createReadStream(__dirname + `/${data.category}.txt`);
    // Ask chain for response to user message and send
    chain.seed(file, () => __awaiter(void 0, void 0, void 0, function* () {
        message.channel.sendTyping();
        setTimeout(() => {
            const response = chain.respond(message.content);
            message.reply(response.join(" "));
        }, 2000);
    }));
    // Remove user from ratelimit
    setTimeout(() => {
        ratelimit.delete(message.author.id);
    }, ((userData === null || userData === void 0 ? void 0 : userData.ratelimit) || 1) != 0 ? 0 : ratelimit.get(message.author.id));
}));
// Get files from directory
const getFilesInDirectory = (dir) => {
    let files = [];
    const filesInDir = fs.readdirSync(dir);
    for (const file of filesInDir) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory())
            files = files.concat(getFilesInDirectory(filePath));
        else
            files.push(filePath);
    }
    return files;
};
// Add Commands
const commands = new Map();
const commandFiles = getFilesInDirectory("./dist/commands").filter((file) => file.endsWith(".js"));
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
const modals = new Map();
const modalFiles = getFilesInDirectory("./dist/modals").filter((file) => file.endsWith(".js"));
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
const buttons = new Map();
const buttonFiles = getFilesInDirectory("./dist/buttons").filter((file) => file.endsWith(".js"));
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
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // Block banned users
    if (bannedUsers.includes(interaction.user.id))
        return;
    // Slash Command
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (command) {
            try {
                yield command.execute(client, interaction, EmbedBuilder, codeBlock, db);
            }
            catch (error) {
                console.error(error);
                let embed = new EmbedBuilder()
                    .setTitle("brain damage")
                    .setColor(0xff0000)
                    .addFields({
                    name: "Message",
                    value: codeBlock("javascript", error),
                    inline: false,
                });
                yield interaction.reply({
                    embeds: [embed],
                });
            }
        }
        else {
            yield interaction.reply("This command does not exist.");
        }
    }
    // Button
    if (interaction.isButton()) {
        const button = buttons.get(interaction.customId);
        const command = commands.get(interaction.customId);
        if (button) {
            try {
                yield button.execute(client, interaction, EmbedBuilder, codeBlock, db);
            }
            catch (error) {
                console.error(error);
                let embed = new EmbedBuilder()
                    .setTitle("brain damage")
                    .setColor(0xff0000)
                    .addFields({
                    name: "Message",
                    value: codeBlock("javascript", error),
                    inline: false,
                });
                yield interaction.reply({
                    embeds: [embed],
                });
            }
        }
        else {
            // Check if button is equal to a slash command
            if (command) {
                try {
                    yield command.execute(client, interaction, EmbedBuilder, codeBlock, db);
                }
                catch (error) {
                    console.error(error);
                    let embed = new EmbedBuilder()
                        .setTitle("brain damage")
                        .setColor(0xff0000)
                        .addFields({
                        name: "Message",
                        value: codeBlock("javascript", error),
                        inline: false,
                    });
                    yield interaction.reply({
                        embeds: [embed],
                    });
                }
            }
            else {
                // button does not equal to anything
                yield interaction.reply("This button does not have any functionality.");
            }
        }
    }
    // Modal
    if (interaction.type === InteractionType.ModalSubmit) {
        // Block banned users
        if (bannedUsers.includes(interaction.user.id))
            return;
        const modal = modals.get(interaction.customId);
        if (!modal) {
            let embed = new EmbedBuilder()
                .setTitle("Error")
                .setColor(0xff0000)
                .setDescription("Command does not exist!");
            yield interaction.reply({
                embeds: [embed],
            });
        }
        try {
            yield (modal === null || modal === void 0 ? void 0 : modal.execute(client, interaction, EmbedBuilder, codeBlock, db));
        }
        catch (error) {
            let embed = new EmbedBuilder()
                .setTitle("brain damage")
                .setColor(0xff0000)
                .addFields({
                name: "Message",
                value: codeBlock("javascript", error),
                inline: false,
            });
            yield interaction.reply({
                embeds: [embed],
            });
        }
    }
}));
// Login to Discord
client.login(process.env.TOKEN);
