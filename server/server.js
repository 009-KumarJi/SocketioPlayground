import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config({path: './.env'});

const PORT = process.env.PORT || 3000;
export const mode = process.env.NODE_ENV.trim() || 'PRODUCTION';

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${mode} mode.`);
});
