import http from 'node:http'
import { WebSocketServer } from 'ws';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { redisPublish, redisSubscribe } from './connection.js';
import { channel } from 'node:diagnostics_channel';


const PORT = process.env.PORT ?? 8001;
const REDIS_CHANNEL = 'ws-server';

const httpServer = http.createServer(async function (req, res) {
    const fileContent = await readFile(path.resolve('./index.html'), 'utf-8');

    res.setHeader('Content-Type', 'text/html');
    res.end(fileContent);
})

const wsServer = new WebSocketServer({ server: httpServer })

redisSubscribe.subscribe(REDIS_CHANNEL);
redisSubscribe.on('message', (channel, message) => {
    if(channel === REDIS_CHANNEL){
        // Broadcast message to all of your connected clients
        wsServer.clients.forEach(client => {
            client.send(message.toString());
        })
    }
})

wsServer.on('connection', (websocket) => {
    console.log("Socket Connected");

    websocket.on('message', async (data) => {
        console.log(`Message Recieved with Data:`, data.toString());

        // relay the message to the broker
        console.log('Relaying Message to Broker');
        await redisPublish.publish(REDIS_CHANNEL, data.toString());
    })
})

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});