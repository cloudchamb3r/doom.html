
const cos = Math.cos;
const sin = Math.sin;
const abs = Math.abs;
const floor = Math.floor;
const tan = Math.tan;
const atan = Math.atan;
const round = Math.round;
const sqrt = Math.sqrt;
const pow = Math.pow;

const sign = (x) => {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

const dist = (x1, y1, x2, y2) =>  sqrt(pow((x1 - x2), 2) + pow((y1 - y2), 2))


const dot = (x1, y1, x2, y2) => x1 * x2 + y1 * y2;
export {
    cos, sin, abs, floor, tan, atan, sign, round, sqrt, dist, dot
}