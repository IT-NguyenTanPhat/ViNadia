import { Schema, model } from 'mongoose';

const FriendshipSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['requested', 'accepted'],
      default: 'requested',
    },
  },
  {
    timestamps: true,
  }
);

export const FriendshipModel = model('Friendship', FriendshipSchema);
