import { resize } from '../../math';
import { Vector } from '../../Vector';
import { maxSpeed } from '../shared';

const ws = new WebSocket('ws://localhost:4242');

ws.onopen = () => {
    document.addEventListener('mousemove', e => {
        const x = e.screenX - window.screen.width / 2;
        const y = e.screenY - window.screen.height / 2;

        const v = { x, y };
        resize(v, maxSpeed);

        const bytes = Vector.toBytes(v);
        ws.send(bytes);
    });
};
