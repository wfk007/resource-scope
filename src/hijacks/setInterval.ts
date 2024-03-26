/**
 * 劫持 setInterval
 *
 * TODO Reflect 和 Proxy 的兼容性问题
 */
import type { Options } from "@/types";

export function hijackSetInterval(signal: AbortSignal, options: Options) {
  const global = options.global || window;
  const oldSetInterval = global.setInterval;
  global.setInterval = new Proxy(global.setInterval, {
    apply(target, thisArg, argumentsList) {
      const intervalId = Reflect.apply(target, thisArg, argumentsList);
      signal.addEventListener(
        "abort",
        () => {
          global.clearInterval(intervalId);
        },
        { once: true, _unUseResourceScopeSignal: true },
      );
      return intervalId;
    },
  });
  return () => {
    global.setInterval = oldSetInterval;
  };
}
