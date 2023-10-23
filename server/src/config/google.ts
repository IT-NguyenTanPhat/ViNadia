import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const GG_CLIENT_ID = process.env.GG_CLIENT_ID;
const GG_CLIENT_SECRET = process.env.GG_CLIENT_SECRET;

export const ggClient = new google.auth.OAuth2(
  GG_CLIENT_ID,
  GG_CLIENT_SECRET,
  'postmessage'
);
