import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: String,
    description: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: Array,
  },
  {
    timestamps: true,
  }
);

export const PostModel = model('Post', PostSchema);
