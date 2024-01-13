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
import { PermissionsBitField, ChannelType } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("markov")
        .setDescription("Talk with me, in a channel!")
        .addChannelOption((option) => option
        .setName("channel")
        .setDescription("The channel you want me to chat in")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
        .addStringOption((option) => option
        .setName("category")
        .setDescription("What type of response would you like to receive?")
        .setRequired(true)
        .addChoices({ name: "Brain Damage", value: "brain_damage" }, { name: "Failure", value: "failure" })),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel("channel");
            const category = interaction.options.getString("category");
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
                return interaction.reply("You do not have permission to use this command!");
            if (category.endsWith("nsfw")) {
                if (!channel.nsfw)
                    return interaction.reply("This category can only be used in NSFW channels!");
                else if (channel.nsfw) {
                    db.aiChannels.add(channel.id, interaction.guild.id, category);
                    interaction.reply({
                        content: `You can now talk with me in the <#${channel.id}> channel!`,
                    });
                }
            }
            else {
                db.aiChannels.add(channel.id, interaction.guild.id, category);
                interaction.reply({
                    content: `You can now talk with me in the <#${channel.id}> channel!`,
                });
            }
        });
    },
};
