/**
 * Request animation frame (limiter).
 * Uses return value of `fn` to decide whether to stop animation
 * or not.
 * @function module:utils.rafLimiter
 * @param fn {Function} - Receives `delta` (look at function src).
 * @param [fps = 60] {Number}
 * @returns {undefined}
 */
export default function rafLimiter (fn, fps = 60) {
    const interval = 1000 / fps;
    let then = Date.now();

    return (function loop (/*timestamp*/) {
        let now = Date.now(),
            delta = now - then,
            stopAnimation;
        if (delta > interval) {
            // Update time
            // now - (delta % interval) is an improvement over just
            // using then = now, which can end up lowering overall fps
            then = now - (delta % interval);

            // call the fn
            stopAnimation = fn(delta);
        }
        return stopAnimation ? undefined :
            requestAnimationFrame(loop);
    }(then));
}
