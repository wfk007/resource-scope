import hijacks from "./hijacks";
import type { Options } from "@/types";

function resourceScope(options: Options) {
  let controllerList: AbortController[] = [];
  return {
    run: (fn: (...args: any) => any) => {
      const controller = new AbortController();
      const { signal } = controller;

      const handlers: Array<(...args: any) => void> = [];

      hijacks.forEach((fn) => handlers.push(fn(signal, options)));

      try {
        fn();
      } catch (error) {}

      // 暂存 controller
      controllerList.push(controller);

      // 复原劫持的函数
      handlers.forEach((handler) => handler());
    },
    dispose: () => {
      controllerList.forEach((controller) => controller.abort());
      controllerList.length = 0;
    },
  };
}

export { resourceScope };
