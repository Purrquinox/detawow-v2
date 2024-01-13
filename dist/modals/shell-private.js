var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { exec } from "child_process";
export default {
    data: {
        name: "shell-private",
    },
    execute(client, interaction, EmbedBuilder, codeBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = interaction.fields.getTextInputValue("command");
            let inline = interaction.fields.getTextInputValue("inline") || "n";
            let hidden = interaction.fields.getTextInputValue("hidden") || "n";
            let embed;
            if (inline.toLowerCase() === "y")
                inline = true;
            else
                inline = false;
            const limit = (value) => {
                let max_chars = 700;
                let i;
                if (value.length > max_chars)
                    i = value.substr(0, max_chars);
                else
                    i = value;
                return i;
            };
            const clean = (text) => __awaiter(this, void 0, void 0, function* () {
                if (text && text.constructor.name == "Promise")
                    text = yield text;
                if (typeof text !== "string")
                    text = require("util").inspect(text, {
                        depth: 1,
                    });
                text = text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
                return text;
            });
            try {
                exec(command, (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
                    const results = yield clean(stdout);
                    if (err) {
                        embed = new EmbedBuilder()
                            .setTitle("Bash Results")
                            .setColor(0xff0000)
                            .addFields({
                            name: "Input:",
                            value: codeBlock("bash", limit(command)),
                            inline: inline,
                        }, {
                            name: "Output:",
                            value: codeBlock("bash", limit(err)),
                            inline: inline,
                        })
                            .setFooter({
                            iconURL: interaction.user.displayAvatarURL(),
                            text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                        });
                        if (hidden.toLowerCase() === "y") {
                            yield interaction.deferReply({
                                ephemeral: true,
                            });
                            yield interaction.followUp({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        }
                        else {
                            yield interaction.reply({
                                embeds: [embed],
                            });
                        }
                    }
                    else {
                        embed = new EmbedBuilder()
                            .setTitle("Bash Results")
                            .setColor(0x00ff00)
                            .addFields({
                            name: "Input:",
                            value: codeBlock("bash", limit(command)),
                            inline: inline,
                        }, {
                            name: "Results:",
                            value: codeBlock("bash", limit(results)),
                            inline: inline,
                        })
                            .setFooter({
                            iconURL: interaction.user.displayAvatarURL(),
                            text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                        });
                        if (hidden.toLowerCase() === "y") {
                            yield interaction.deferReply({
                                ephemeral: true,
                            });
                            yield interaction.followUp({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        }
                        else {
                            yield interaction.reply({
                                embeds: [embed],
                            });
                        }
                    }
                }));
            }
            catch (err) {
                embed = new EmbedBuilder()
                    .setTitle("Bash Results")
                    .setColor(0xff0000)
                    .addFields({
                    name: "Input:",
                    value: codeBlock("bash", limit(command)),
                    inline: inline,
                }, {
                    name: "Output:",
                    value: codeBlock("bash", limit(err)),
                    inline: inline,
                })
                    .setFooter({
                    iconURL: interaction.user.displayAvatarURL(),
                    text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                });
                if (hidden.toLowerCase() === "y") {
                    yield interaction.deferReply({
                        ephemeral: true,
                    });
                    yield interaction.followUp({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }
                else {
                    yield interaction.reply({
                        embeds: [embed],
                    });
                }
            }
        });
    },
};
