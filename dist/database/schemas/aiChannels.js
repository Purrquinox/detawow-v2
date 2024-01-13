import mongoose from "mongoose";
const { Schema } = mongoose;
const schema = new Schema({
    channel_id: String,
    guild_id: String,
    category: String,
});
export default mongoose.model("aiChannels", schema);
