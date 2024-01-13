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
        name: "copy-admin",
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
            yield interaction.reply({
                content: codeBlock("javascript", limit(code)),
                ephemeral: true,
            });
        });
    },
};
