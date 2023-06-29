import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    avatar: { type: String, default: '' },
    friends: { type: [Schema.Types.ObjectId], ref: 'User' },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  {
    timestamps: true,
    methods: {
      comparePassword: async function (password) {
        console.log(password, this.password);
        return await bcrypt.compare(password, this.password);
      },
    },
  }
);

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const UserModel = model('User', UserSchema);
