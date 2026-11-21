/**
 * One shared, rAF-throttled scroll/resize loop for every parallax element.
 * Components subscribe a callback; nothing runs when reduced motion is on.
 */
type Fn = () => void;
const subs = new Set<Fn>();
let ticking = false;
let bound = false;

function frame() {
  ticking = false;
  subs.forEach((f) => f());
}
function request() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function onScroll(fn: Fn) {
  if (reducedMotion()) return () => {};
  subs.add(fn);
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
  }
  request();
  return () => {
    subs.delete(fn);
  };
}
