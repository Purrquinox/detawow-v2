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
        .setName("bruh")
        .setDescription("i hate my life..."),
    execute(client, interaction, EmbedBuilder, codeBlock, db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({
                content: client.user.displayAvatarURL(),
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "BRUH",
                                style: 4,
                                custom_id: "unknown",
                                disabled: true,
                            },
                        ],
                    },
                ],
            });
        });
    },
};
