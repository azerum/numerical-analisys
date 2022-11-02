import * as sd from 'sirdez';

export var Vector = sd.use(sd.struct({
    x: sd.float64,
    y: sd.float64
}));

export type Vector = sd.GetType<typeof Vector>;
