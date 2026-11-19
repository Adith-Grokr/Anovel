"use client";

// Small localStorage-backed stores for buyer-only demo state (samples, saved items, currency).
// Shared demo data (requirements, quotations, orders…) lives in lib/demo-store.ts.
import { useSyncExternalStore } from "react";

export interface LocalStore<T> {
  use: () => T;
  get: () => T;
  set: (updater: (prev: T) => T) => void;
}

export function createLocalStore<T>(key: string, seed: T): LocalStore<T> {
  let state = seed;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* storage unavailable — keep seed */
    }
  };

  const get = () => {
    load();
    return state;
  };

  const set = (updater: (prev: T) => T) => {
    state = updater(get());
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  };

  return {
    get,
    set,
    use: () => useSyncExternalStore(subscribe, get, () => seed),
  };
}
