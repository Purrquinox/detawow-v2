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
        .setName("bash")
        .setDescription("Run bash commands inside of a container!"),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let modal;
            const admins = client.admins;
            if (admins.includes(interaction.user.id)) {
                modal = new ModalBuilder()
                    .setCustomId("shell-private")
                    .setTitle("Shell (Admin)");
                const command = new TextInputBuilder()
                    .setCustomId("command")
                    .setLabel("Command")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setPlaceholder("Command to execute...")
                    .setRequired(true);
                const inline = new TextInputBuilder()
                    .setCustomId("inline")
                    .setLabel("Do you want the embed to be inlined?")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setPlaceholder("Y/N [Default: N]")
                    .setRequired(false);
                const hidden = new TextInputBuilder()
                    .setCustomId("hidden")
                    .setLabel("Hidden?")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setPlaceholder("Y/N [Default: N]")
                    .setRequired(false);
                modal.addComponents([
                    new ActionRowBuilder().addComponents(command),
                    new ActionRowBuilder().addComponents(inline),
                    new ActionRowBuilder().addComponents(hidden),
                ]);
            }
            else {
                modal = new ModalBuilder()
                    .setCustomId("shell-public")
                    .setTitle("Shell (Public)");
                const command = new TextInputBuilder()
                    .setCustomId("command")
                    .setLabel("Command")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(5)
                    .setPlaceholder("Command to execute...")
                    .setRequired(true);
                const inline = new TextInputBuilder()
                    .setCustomId("inline")
                    .setLabel("Do you want the embed to be inlined?")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setPlaceholder("Y/N [Default: N]")
                    .setRequired(false);
                const hidden = new TextInputBuilder()
                    .setCustomId("hidden")
                    .setLabel("Do you want the results to be private?")
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(1)
                    .setPlaceholder("Y/N [Default: N]")
                    .setRequired(false);
                modal.addComponents([
                    new ActionRowBuilder().addComponents(command),
                    new ActionRowBuilder().addComponents(inline),
                    new ActionRowBuilder().addComponents(hidden),
                ]);
            }
            interaction.showModal(modal, {
                client: client,
                interaction: interaction,
            });
        });
    },
};
