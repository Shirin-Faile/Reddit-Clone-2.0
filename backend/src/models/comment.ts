import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    content: string;
    user: mongoose.Schema.Types.ObjectId;
    post: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);