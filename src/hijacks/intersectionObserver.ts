/**
 * 劫持 IntersectionObserver
 *
 * TODO Proxy 的兼容性问题
 */
import type { Options } from "@/types";

export function hijackIntersectionObserver(
  signal: AbortSignal,
  options: Options,
) {
  const global = options.global || window;
  const oldIntersectionObserver = global.IntersectionObserver;
  global.IntersectionObserver = new Proxy(global.IntersectionObserver, {
    construct(target, args) {
      // 收集 intersectionObserver 实例
      const intersectionObserver = new target(...args);
      signal.addEventListener(
        "abort",
        () => {
          intersectionObserver.disconnect();
        },
        { once: true, _unUseResourceScopeSignal: true },
      );
      return intersectionObserver;
    },
  });
  return () => {
    global.IntersectionObserver = oldIntersectionObserver;
  };
}
