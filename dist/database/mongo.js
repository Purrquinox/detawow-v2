var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Packages
import mongoose from "mongoose";
import logger from "../logger.js";
import * as dotenv from "dotenv";
// Configure dotenv
dotenv.config();
// Schemas
import evalPublicSchema from "./schemas/eval_public.js";
import evalPrivateSchema from "./schemas/eval_private.js";
import aiChannelsSchema from "./schemas/aiChannels.js";
import usersSchema from "./schemas/users.js";
// Initalize MongoDB
const mongo = mongoose.connect(process.env.MONGO);
const eval_public = {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield evalPublicSchema.find({});
            return data[0];
        });
    },
    replace(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield evalPublicSchema.find({});
            let returned;
            evalPublicSchema.replaceOne(data[0], obj, null, (err, doc) => {
                if (err) {
                    logger.error("400", `MongoDB Document Replace Error`, err);
                }
                else {
                    returned = doc;
                }
            });
            return returned;
        });
    },
};
const eval_private = {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield evalPrivateSchema.find({});
            return data[0];
        });
    },
    replace(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield evalPrivateSchema.find({});
            let returned;
            evalPrivateSchema.replaceOne(data[0], obj, null, (err, doc) => {
                if (err) {
                    logger.error("400", `MongoDB Document Replace Error`, err);
                }
                else {
                    returned = doc;
                }
            });
            return returned;
        });
    },
};
const aiChannels = {
    get(channel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield aiChannelsSchema.findOne({
                channel_id: channel_id,
            });
            return data;
        });
    },
    add(channel_id, guild_id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new aiChannelsSchema({
                channel_id: channel_id,
                guild_id: guild_id,
                category: category,
            });
            doc.save()
                .then(() => {
                logger.info("200", "MongoDB Document Created", {});
            })
                .catch((err) => {
                logger.error("400", `MongoDB Document Create Error`, err);
            });
        });
    },
};
const users = {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield usersSchema.findOne({
                user_id: id,
            });
            return data;
        });
    },
    createUser(user_id, ratelimit) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new usersSchema({
                user_id: user_id,
                badges: [],
                ratelimit: ratelimit,
                bio: null,
            });
            doc.save()
                .then(() => {
                logger.info("200", "MongoDB Document Created", {});
            })
                .catch((err) => {
                logger.error("400", `MongoDB Document Create Error`, err);
            });
        });
    },
    addBadge(user_id, badgeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield usersSchema.findOne({
                user_id: user_id,
            });
            let badges = data.badges;
            badges.push(badgeData);
            usersSchema.replaceOne({ user_id: data.user_id }, data, null, (err, doc) => {
                if (err) {
                    logger.error("400", `MongoDB Document Replace Error`, err);
                }
                else {
                    returned = doc;
                }
            });
        });
    },
};
export default {
    eval_public,
    eval_private,
    aiChannels,
    users,
};
