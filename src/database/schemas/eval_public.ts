import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
	language: String,
	input: String,
	output: String,
	version: String,
});

export default mongoose.model("EvalPublic", schema);
