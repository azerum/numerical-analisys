import { WebSocketServer } from 'ws';
import { lengthEqual } from '../math';
import { Vector } from '../Vector';
import { maxSpeed } from './shared';

const server = new WebSocketServer({
    port: 4242
});

server.once('listening', () => console.log(`Listening on port ${server.options.port}`));

process.once('SIGINT', () => {
    console.log();

    server.clients.forEach(ws => ws.close());
    server.close();
});

server.on('connection', ws => {
    console.log('Connected');

    ws.binaryType = 'nodebuffer';

    ws.on('message', data => {
        if (!(data instanceof Buffer)) {
            console.log('Got non-Buffer data');
            ws.close();
            return;
        }

        const v = Vector.fromBytes(data);

        if (!lengthEqual(v, maxSpeed)) {
            console.log(v.x);
            console.log(v.y);
            ws.close();
        }
    });
});
