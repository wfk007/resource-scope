/**
 * 劫持 AddEventListener
 *
 * TODO 需要补充以下的测试用例
 * 1. 第三个参数未传
 * window.addEventListener("resize", () => console.log("resize"));
 *
 * 2. 第三个参数传了 options 格式（对象形式）
 * window.addEventListener("resize", () => console.log("resize"), { capture: true, once: true });
 *
 * 3. 第三个参数使用 useCapture 格式（布尔）
 * window.addEventListener("resize", () => console.log("resize"), true);
 *
 * 4. 第三个参数传了 options 格式，并且使用了 signal
 * window.addEventListener("resize", () => console.log("resize"), { signal });
 */
import type { Options } from "@/types";
export function hijackAddEventListener(signal: AbortSignal, options: Options) {
  const global = options.global || window;

  const oldAddEventListener = global.EventTarget.prototype.addEventListener;
  global.EventTarget.prototype.addEventListener = function (...args) {
    const [name, callback, options = {}] = args;
    let targetOptions: AddEventListenerOptions | undefined;
    if (typeof options === "boolean") {
      targetOptions = {
        capture: options,
        signal,
      };
    } else {
      // 业务有 signal，这里就不能再通过 signal 来移除事件了，需要使用 removeEventListener
      if (options.signal instanceof AbortSignal) {
        signal.addEventListener(
          "abort",
          () => {
            global.EventTarget.prototype.removeEventListener.call(
              this,
              name,
              callback,
              options,
            );
          },
          {
            once: true,
            _unUseResourceScopeSignal: true,
          },
        );
      } else {
        /**
         * NOTE 注意：
         * 这个方法也会劫持后续其他 signal addEventListener abort 事件
         * 如果不加以区分，会导致其他事件的监听不生效，内部劫持的方法
         * 如果需要监听 signal 的 abort 事件，建议都添加 _unUseResourceScopeSignal 配置
         */
        targetOptions = options._unUseResourceScopeSignal
          ? options
          : {
              signal,
              ...options,
            };
      }
    }
    oldAddEventListener.call(this, name, callback, targetOptions);
  };
  return () => {
    global.EventTarget.prototype.addEventListener = oldAddEventListener;
  };
}
