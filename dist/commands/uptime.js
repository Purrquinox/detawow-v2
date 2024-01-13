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
        .setName("uptime")
        .setDescription("How long have i been alive for?"),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            const formatTime = (seconds) => {
                const days = Math.floor(seconds / 86400);
                seconds -= days * 86400;
                const hours = Math.floor(seconds / (60 * 60));
                seconds -= hours * 3600;
                const minutes = Math.floor((seconds % (60 * 60)) / 60);
                seconds -= minutes * 60;
                const secs = Math.floor(seconds % 60);
                return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
            };
            yield interaction.reply({
                content: formatTime(process.uptime()),
            });
        });
    },
};
