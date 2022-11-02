import { lengthEqual, resize } from './math';

const count = 10_000_000;
const m = 100_000;

for (let i = 0; i < count; ++i) {
    const x = Math.random(); 
    const y = Math.random();

    const v = { x, y };
    resize(v, m);

    if (!lengthEqual(v, m)) {
        console.log(x);
        console.log(y);
        break;
    }
}
