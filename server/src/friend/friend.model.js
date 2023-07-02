import { Schema, model } from 'mongoose';

const FriendSchema = new Schema(
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

export const FriendModel = model('Friend', FriendSchema);
