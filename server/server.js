import express from 'express';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
dotenv.config({path: './.env'});

const server = createServer(app);
const io = new Server(server, {});

const PORT = process.env.PORT || 3000;
export const mode = process.env.NODE_ENV.trim() || 'PRODUCTION';

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on("connection", (socket) => {
    console.log(`Socket with ID '${socket.id}' connected!`)

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${mode} mode.`);
});
