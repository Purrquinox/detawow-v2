import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
	input: String,
	output: String,
	type: String,
	modal: String,
});

export default mongoose.model("EvalPrivate", schema);
