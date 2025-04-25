import { config } from "dotenv";

config();

export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    tokenExpiryBuffer: 300, // 5 minutos de buffer anted de de que expire el token
    scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ]
}

// console.log(googleConfig);