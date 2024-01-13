var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Eval from "open-eval";
const ev = new Eval();
export default {
    data: {
        name: "eval-public",
    },
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let language = interaction.fields.getTextInputValue("language") || "javascript";
            const code = interaction.fields.getTextInputValue("code");
            let inline = interaction.fields.getTextInputValue("inline") || "n";
            let hidden = interaction.fields.getTextInputValue("hidden") || "n";
            let embed;
            if (language.toLowerCase() === "nodejs")
                language = "javascript";
            if (inline.toLowerCase() === "y")
                inline = true;
            else
                inline = false;
            const bannedLangs = [];
            const limit = (value) => {
                let max_chars = 700;
                let i;
                if (value.length > max_chars)
                    i = value.substr(0, max_chars);
                else
                    i = value;
                return i;
            };
            if (bannedLangs.includes(language)) {
                embed = new EmbedBuilder()
                    .setTitle("Evaluation Results")
                    .setColor(0xff0000)
                    .setDescription("This language is not supported at this time. Please try again later.");
            }
            else {
                let results = yield ev
                    .eval(language, code)
                    .then((results) => __awaiter(this, void 0, void 0, function* () {
                    embed = new EmbedBuilder()
                        .setTitle("Evaluation Results")
                        .setColor(0x00ff00)
                        .addFields({
                        name: "Language:",
                        value: results.language || "No language detected!",
                        inline,
                    }, {
                        name: "Input:",
                        value: codeBlock(results.language || language, limit(code)),
                        inline,
                    }, {
                        name: "Output:",
                        value: codeBlock(results.language || language, limit(results.output || results.message)),
                        inline,
                    }, {
                        name: "Version:",
                        value: results.version || "No version detected!",
                        inline,
                    })
                        .setFooter({
                        iconURL: interaction.user.displayAvatarURL(),
                        text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                    });
                    db.eval_public.replace({
                        language: results.language || "No language detected!",
                        input: code,
                        output: results.output || results.message,
                        version: results.version || "No version detected!",
                    });
                }))
                    .catch((error) => __awaiter(this, void 0, void 0, function* () {
                    embed = new EmbedBuilder()
                        .setTitle("Evaluation Results")
                        .setColor(0xff0000)
                        .addFields({
                        name: "Input:",
                        value: codeBlock(language, limit(code)),
                        inline,
                    }, {
                        name: "Output:",
                        value: codeBlock(language, limit(error)),
                        inline,
                    })
                        .setFooter({
                        iconURL: interaction.user.displayAvatarURL(),
                        text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                    });
                    db.eval_public.replace({
                        language: results.language || "No language detected!",
                        input: code,
                        output: results.output || results.message,
                        version: results.version || "No version detected!",
                    });
                }));
            }
            let buttons = {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Save as File",
                        style: 1,
                        custom_id: "saveasfile-public",
                        disabled: true,
                    },
                    {
                        type: 2,
                        label: "Copy Code",
                        style: 3,
                        custom_id: "copy-public",
                        disabled: true,
                    },
                ],
            };
            if (hidden.toLowerCase() === "y") {
                yield interaction.deferReply({
                    ephemeral: true,
                });
                yield interaction.followUp({
                    embeds: [embed],
                    components: [buttons],
                    ephemeral: true,
                });
            }
            else {
                yield interaction.reply({
                    embeds: [embed],
                    components: [buttons],
                });
            }
        });
    },
};
