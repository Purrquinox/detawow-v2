var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default {
    data: {
        name: "reevaluate",
    },
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield db.eval_private.get();
            const code = data.input;
            const admins = client.admins;
            if (!admins.includes(interaction.user.id))
                return;
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
                let evaled = eval(code);
                let results = yield clean(evaled);
                let type = typeof evaled;
                let typeOf = type.charAt(0).toUpperCase() + type.slice(1);
                const tree = (obj) => {
                    const data = [];
                    if (obj === undefined || obj === null)
                        data.push(`${obj}`);
                    while (obj) {
                        data.push(obj.constructor.name);
                        obj = Object.getPrototypeOf(obj);
                    }
                    return data.reverse().join(" -> ");
                };
                embed = new EmbedBuilder()
                    .setTitle("Evaluation Results")
                    .setColor(0x00ff00)
                    .addFields({
                    name: "Input:",
                    value: codeBlock("javascript", limit(code)),
                    inline: false,
                }, {
                    name: "Output:",
                    value: codeBlock("javascript", limit(results)),
                    inline: false,
                }, {
                    name: "Type:",
                    value: codeBlock("javascript", typeOf),
                    inline: false,
                }, {
                    name: "Prototype:",
                    value: codeBlock("javascript", tree(evaled)),
                    inline: false,
                })
                    .setFooter({
                    iconURL: interaction.user.displayAvatarURL(),
                    text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                });
                db.eval_private.replace({
                    input: code,
                    output: results,
                    type: typeOf,
                    modal: tree(evaled),
                });
            }
            catch (err) {
                embed = new EmbedBuilder()
                    .setTitle("Evaluation Results")
                    .setColor(0xff0000)
                    .addFields({
                    name: "Input:",
                    value: codeBlock("javascript", limit(code)),
                    inline: false,
                }, {
                    name: "Output:",
                    value: codeBlock("javascript", limit(err)),
                    inline: false,
                }, {
                    name: "Type:",
                    value: codeBlock("javascript", "Error"),
                    inline: false,
                })
                    .setFooter({
                    iconURL: interaction.user.displayAvatarURL(),
                    text: `Executed by ${interaction.user.username}, in about ${Math.floor(Date.now() - interaction.createdAt)} milliseconds`,
                });
                db.eval_private.replace({
                    input: code,
                    output: err,
                    type: "Error",
                    modal: "Error",
                });
            }
            let buttons = {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: "Save as File",
                        style: 1,
                        custom_id: "saveasfile-admin",
                    },
                    {
                        type: 2,
                        label: "Copy Code",
                        style: 3,
                        custom_id: "copy-admin",
                    },
                    {
                        type: 2,
                        label: "Reevaluate",
                        style: 4,
                        custom_id: "reevaluate",
                    },
                ],
            };
            yield interaction.reply({
                embeds: [embed],
                components: [buttons],
            });
        });
    },
};
