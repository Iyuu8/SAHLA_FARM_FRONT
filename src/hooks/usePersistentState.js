import { useEffect, useMemo, useState } from 'react';

const STORAGE_SYNC_EVENT = 'sahla-storage-sync';

function resolveInitial(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue;
}

/**
 * Shared persistent state hook.
 *
 * How it works with pages/components:
 * - Any page can read/write the same key without prop drilling.
 * - Writes are saved to localStorage to simulate backend persistence.
 * - A custom in-tab event keeps multiple mounted consumers in sync.
 */
export default function usePersistentState(key, initialValue) {
  const fallbackValue = useMemo(() => resolveInitial(initialValue), [initialValue]);

  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return fallbackValue;

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(key, serialized);
      window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, {
        detail: { key, value: serialized },
      }));
    } catch {
      // Ignore persistence failures to avoid blocking UI interactions.
    }
  }, [key, state]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleCustomSync = (event) => {
      const detail = event?.detail;
      if (!detail || detail.key !== key) return;

      try {
        const next = JSON.parse(detail.value);
        setState((prev) => {
          const prevSerialized = JSON.stringify(prev);
          return prevSerialized === detail.value ? prev : next;
        });
      } catch {
        // Ignore malformed values.
      }
    };

    const handleNativeStorage = (event) => {
      if (event.key !== key || event.newValue == null) return;

      try {
        const next = JSON.parse(event.newValue);
        setState((prev) => {
          const prevSerialized = JSON.stringify(prev);
          return prevSerialized === event.newValue ? prev : next;
        });
      } catch {
        // Ignore malformed values.
      }
    };

    window.addEventListener(STORAGE_SYNC_EVENT, handleCustomSync);
    window.addEventListener('storage', handleNativeStorage);

    return () => {
      window.removeEventListener(STORAGE_SYNC_EVENT, handleCustomSync);
      window.removeEventListener('storage', handleNativeStorage);
    };
  }, [key]);

  return [state, setState];
}
