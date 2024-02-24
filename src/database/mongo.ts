// Packages
import mongoose from "mongoose";
import * as logger from "../logger.js";
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
	async get() {
		const data = await evalPublicSchema.find({});
		return data[0];
	},

	async replace(obj) {
		const data: {
			input: string;
			output: string;
			language: string;
			version: string;
		}[] = await evalPublicSchema.find({});

		return await evalPublicSchema.replaceOne(data[0], obj, null);
	},
};

const eval_private = {
	async get() {
		const data = await evalPrivateSchema.find({});
		return data[0];
	},

	async replace(obj) {
		const data: {
			input?: string;
			output?: string;
			type?: string;
			modal?: string;
		}[] = await evalPrivateSchema.find({});

		return await evalPrivateSchema.replaceOne(data[0], obj, null);
	},
};

const aiChannels = {
	async get(channel_id) {
		const data = await aiChannelsSchema.findOne({
			channel_id: channel_id,
		});

		return data;
	},

	async add(channel_id, guild_id, category) {
		const doc = new aiChannelsSchema({
			channel_id: channel_id,
			guild_id: guild_id,
			category: category,
		});

		doc.save()
			.then(() => {
				logger.info("200", "MongoDB Document Created");
			})
			.catch((err) => {
				logger.error("400", `MongoDB Document Create Error` + err);
			});
	},
};

const users = {
	async get(id) {
		const data = await usersSchema.findOne({
			user_id: id,
		});

		return data;
	},

	async createUser(user_id, ratelimit) {
		const doc = new usersSchema({
			user_id: user_id,
			badges: [],
			ratelimit: ratelimit,
			bio: null,
		});

		doc.save()
			.then(() => {
				logger.info("200", "MongoDB Document Created");
			})
			.catch((err) => {
				logger.error("400", `MongoDB Document Create Error` + err);
			});
	},

	async addBadge(user_id, badgeData) {
		const data = await usersSchema.findOne({
			user_id: user_id,
		});

		let badges = data.badges;
		badges.push(badgeData);

		return await usersSchema.replaceOne(
			{ user_id: data.user_id },
			data,
			null
		);
	},
};

export default {
	eval_public,
	eval_private,
	aiChannels,
	users,
};
