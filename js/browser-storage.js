export function getSafeStorage(host = globalThis) {
  let storage = null;
  try { storage = host.localStorage; } catch { storage = null; }

  return {
    getItem(key) {
      try { return storage?.getItem(key) ?? null; } catch { return null; }
    },
    setItem(key, value) {
      try { storage?.setItem(key, value); return Boolean(storage); } catch { return false; }
    },
    removeItem(key) {
      try { storage?.removeItem(key); return Boolean(storage); } catch { return false; }
    }
  };
}
