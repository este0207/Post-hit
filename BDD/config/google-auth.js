export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

import { OAuth2Client } from 'google-auth-library';

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
