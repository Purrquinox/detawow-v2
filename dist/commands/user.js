var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SlashCommandBuilder } from "@discordjs/builders";
export default {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get information about a user.")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("What user do you want to get information about?")
        .setRequired(true)),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the user
            const user = interaction.options.getUser("user");
            const data = yield client.getUser(user.id);
            // Check if the user exists
            if (!data)
                return interaction.reply("I couldn't find that user.");
            // Badges
            const badges = data.otherData.badges;
            let badgeString = "";
            if (badges.length > 0) {
                for (let i = 0; i < badges.length; i++) {
                    badgeString += `- ${badges[i]}\n`;
                }
            }
            else {
                badgeString = "No badges";
            }
            // Trusted
            const trusted = data.otherData.trusted;
            let trustedString = "";
            if (trusted === true) {
                trustedString = "Trusted";
            }
            else {
                trustedString = "Not trusted";
            }
            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(`${data.discordData.username}#${data.discordData.discriminator}`)
                .setThumbnail(data.discordData.avatar_url)
                .setColor(0x00ff00)
                .addFields({
                name: "Username",
                value: String(data.discordData.username),
                inline: false,
            }, {
                name: "Discriminator",
                value: String(data.discordData.discriminator),
                inline: false,
            }, {
                name: "User Bio",
                value: String(data.otherData.bio),
                inline: false,
            }, {
                name: "User ID",
                value: String(data.discordData.id),
                inline: false,
            }, {
                name: "Created At",
                value: String(`<t:${data.discordData.created_at}>`),
                inline: false,
            }, {
                name: "DetaWow Badges",
                value: String(badgeString),
                inline: false,
            }, {
                name: "DetaWow Ratelimit",
                value: String(`${data.otherData.ratelimit} seconds`),
                inline: false,
            }, {
                name: "DetaWow Trusted",
                value: String(trustedString),
                inline: false,
            });
            // Send embed
            interaction.reply({
                embeds: [embed],
            });
        });
    },
};
