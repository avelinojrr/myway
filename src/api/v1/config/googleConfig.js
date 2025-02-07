import { config } from "dotenv";

config();

export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
}

// console.log(googleConfig);