import { Schema, model } from 'mongoose';

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: String,
    description: String,
    likes: { type: Map, of: Boolean },
    comments: Array,
  },
  {
    timestamps: true,
  }
);

export const PostModel = model('Post', PostSchema);
