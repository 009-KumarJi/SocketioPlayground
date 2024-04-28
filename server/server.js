import express from 'express';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'

const app = express();
dotenv.config({path: './.env'});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const PORT = process.env.PORT || 3000;
export const mode = process.env.NODE_ENV.trim() || 'PRODUCTION';

app.use(cors({
    origin: "http://localhost:5000",
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on("connection", (socket) => {
    console.log(`Socket with ID '${socket.id}' connected!`)

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${mode} mode.`);
});
