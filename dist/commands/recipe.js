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
import axios from "axios";
export default {
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("Find a nice cooking recipe")
        .addStringOption((option) => option
        .setName("query")
        .setDescription("What do you want to make?")
        .setRequired(true)),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = interaction.options.getString("query");
            const options = {
                method: "GET",
                url: "https://tasty.p.rapidapi.com/recipes/list",
                params: {
                    q: encodeURIComponent(query),
                    from: "0",
                    size: "10",
                },
                headers: {
                    "X-RapidAPI-Host": "tasty.p.rapidapi.com",
                    "X-RapidAPI-Key": process.env.TASTY_API_KEY,
                },
            };
            axios
                .request(options)
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                let data = response.data.results;
                let desc = "";
                if (data === undefined)
                    return;
                data.forEach((recipe) => __awaiter(this, void 0, void 0, function* () {
                    desc =
                        desc +
                            `- [${recipe.name}](https://tasty.co/recipe/${recipe.slug})\n`;
                }));
                let embed = new EmbedBuilder()
                    .setTitle(`Here are some recipes for ${query}`)
                    .setColor(0x00ff00)
                    .setDescription(desc || `No recipes found for ${query}`)
                    .setFooter({
                    iconURL: interaction.user.displayAvatarURL(),
                    text: `Requested by ${interaction.user.username} | Powered by Tasty!`,
                });
                yield interaction
                    .reply({
                    embeds: [embed],
                })
                    .catch(() => __awaiter(this, void 0, void 0, function* () {
                    yield interaction.channel.send({
                        embeds: [embed],
                    });
                }));
            }))
                .catch((error) => __awaiter(this, void 0, void 0, function* () {
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
            }));
        });
    },
};
