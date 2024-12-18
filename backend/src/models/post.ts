import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now}
});

export default mongoose.model<IPost>('Post', PostSchema);
