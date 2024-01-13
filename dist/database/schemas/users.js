import mongoose from "mongoose";
const { Schema } = mongoose;
const schema = new Schema({
    user_id: String,
    badges: Array,
    ratelimit: Number,
    bio: String,
});
export default mongoose.model("user", schema);
