interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
  _unUseResourceScopeSignal?: boolean; // 是否不使用 signal
}
