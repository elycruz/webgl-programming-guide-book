import {peek} from "./console";

export default function rafLimiter (fn, fps = 60) {
    const interval = 1000 / fps;
    let then = Date.now();

    return (function loop (timestamp) {
        let now = Date.now(),
            delta = now - then;

        if (delta > interval) {
            // Update time
            // now - (delta % interval) is an improvement over just
            // using then = now, which can end up lowering overall fps
            then = now - (delta % interval);

            // call the fn
            fn(delta);
        }

        return requestAnimationFrame(loop);

    }(then));
}
