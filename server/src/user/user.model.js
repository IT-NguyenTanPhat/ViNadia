import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    location: String,
    occupation: String,
    friends: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    friendRequests: {
      type: [
        {
          sender: { type: Schema.Types.ObjectId, ref: 'User' },
          time: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const UserModel = model('User', UserSchema);
