const buffer = new ArrayBuffer(4);
const f32 = new Float32Array(buffer);
const u32 = new Uint32Array(buffer);

//Credits to https://gist.github.com/starfys/aaaee80838d0e013c27d
//With preserved comments
export function inverseSqrt(x: number): number
{       
    const x2 = 0.5 * x;

    //evil floating bit level hacking
    f32[0] = x;
    u32[0] = (0x5f3759df - (u32[0] >> 1)); //What the fuck?

    let y = f32[0];
    y = y * (1.5 - (x2 * y * y)); //1st iteration
    y = y * (1.5 - (x2 * y * y)); //2nd
    y = y * (1.5 - (x2 * y * y)); //3rd

    return y;
}
