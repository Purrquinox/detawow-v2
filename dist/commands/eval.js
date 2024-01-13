var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Run code inside of a container!"),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let modal;
            const admins = client.admins;
            if (admins.includes(interaction.user.id)) {
                modal = new ModalBuilder()
                    .setCustomId("eval-private")
                    .setTitle("Evaluate your Code (Admin)");
                const code = new TextInputBuilder()
                    .setCustomId("code")
                    .setLabel("Code")
                    .setPlaceholder("Write your Code here!")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setRequired(true);
                const inline = new TextInputBuilder()
                    .setCustomId("inline")
                    .setLabel("Do you want the embed to be inlined?")
                    .setPlaceholder("Y/N [Default: N]")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setRequired(false);
                const hidden = new TextInputBuilder()
                    .setCustomId("hidden")
                    .setLabel("Do you want the embed to be hidden?")
                    .setPlaceholder("Y/N [Default: N]")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setRequired(false);
                modal.addComponents(new ActionRowBuilder().addComponents(code), new ActionRowBuilder().addComponents(inline), new ActionRowBuilder().addComponents(hidden));
            }
            else {
                modal = new ModalBuilder()
                    .setCustomId("eval-public")
                    .setTitle("Evaluate your Code (Public)");
                const language = new TextInputBuilder()
                    .setCustomId("language")
                    .setLabel("Language:")
                    .setPlaceholder("What language is the code in? [Default: javascript]")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);
                const code = new TextInputBuilder()
                    .setCustomId("code")
                    .setLabel("Code")
                    .setPlaceholder("Write your Code here!")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(5)
                    .setRequired(true);
                const inline = new TextInputBuilder()
                    .setCustomId("inline")
                    .setLabel("Do you want the embed to be inlined?")
                    .setPlaceholder("Y/N [Default: N]")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setRequired(false);
                const hidden = new TextInputBuilder()
                    .setCustomId("hidden")
                    .setLabel("Do you want the embed to be hidden?")
                    .setPlaceholder("Y/N [Default: N]")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setRequired(false);
                modal.addComponents(new ActionRowBuilder().addComponents(language), new ActionRowBuilder().addComponents(code), new ActionRowBuilder().addComponents(inline), new ActionRowBuilder().addComponents(hidden));
            }
            yield interaction.showModal(modal);
        });
    },
};
