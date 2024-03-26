export interface ResourceScopeAddEventListenerOptions
  extends AddEventListenerOptions {
  _unUseResourceScopeSignal?: boolean; // 是否不使用 signal
}

export interface Options {
  global: Window & typeof globalThis;
}
