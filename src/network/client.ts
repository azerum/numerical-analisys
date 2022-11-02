import { WebSocket } from 'ws';
import { resize } from '../math';
import { Vector } from '../Vector';
import { maxSpeed } from './shared';

const ws = new WebSocket('ws://localhost:4242');

ws.once('open', () => {
    console.log('Connected');

    const loop = (err?: Error )=> {
        if (err) {
            console.log(err);
            return;
        }

        const x = Math.random() * 1000;
        const y = Math.random() * 1000;

        const v = { x, y };
        resize(v, maxSpeed);

        const bytes = Vector.toBytes(v);
        ws.send(bytes, loop);
    };

    loop();
});
