import { inverseSqrt } from './inverse-sqrt';
import { Vector } from './Vector';

const min = 0.9999999999299992;
const max = 1.0000000000700008;

export function resize(v: Vector, length: number) {
    const l = v.x * v.x + v.y * v.y;
    const s = length * inverseSqrt(l);

    v.x *= s;
    v.y *= s;

    return v;
}

export function lengthEqual(v: Readonly<Vector>, length: number) {
    const l = v.x * v.x + v.y * v.y;
    const s = length * inverseSqrt(l);

    return s >= min && s <= max;
}
