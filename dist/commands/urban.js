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
        .setName("urban")
        .setDescription("Search for Urban Dictionary definitions.")
        .setNSFW(true)
        .addStringOption((option) => option
        .setName("query")
        .setDescription("What do you want to search for?")
        .setRequired(true)),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = interaction.options.getString("query");
            if (!interaction.channel.nsfw)
                return interaction.reply("This command can only be used in NSFW channels!");
            let results = yield fetch(`https://api.urbandictionary.com/v0/define?term=${query}`).then((res) => __awaiter(this, void 0, void 0, function* () { return yield res.json(); }));
            if (results.error) {
                let embed = new EmbedBuilder()
                    .setTitle("brain damage")
                    .setColor(0xff0000)
                    .addFields({
                    name: "Message",
                    value: codeBlock("javascript", results.error),
                    inline: false,
                });
                yield interaction.reply({
                    embeds: [embed],
                });
            }
            else if (!results.list.length)
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
                yield interaction.reply({
                    embeds: [embed],
                });
            }
        });
    },
};
