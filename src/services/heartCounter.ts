/**
 * Global Real-time Heart Counter Service
 * 
 * Provides zero-cost, persistent cloud synchronization for hearts given by students
 * across Chandigarh University without requiring any Vercel Pro subscription or paid backend.
 * Uses redundant public high-availability counters with automatic local fallback.
 */

const PRIMARY_COUNTER_URL = 'https://abacus.jasoncameron.dev';
const BACKUP_COUNTER_URL = 'https://countapi.mileshilliard.com';

const NAMESPACE = 'cu_gradepulse';
const KEY = 'hearts';
const COMBINED_KEY = 'cu_gradepulse_hearts';
const CACHE_KEY = 'cu_gradepulse_cached_global_hearts';

export async function getGlobalHearts(): Promise<number> {
  // 1. Try primary counter (Abacus)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${PRIMARY_COUNTER_URL}/get/${NAMESPACE}/${KEY}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        localStorage.setItem(CACHE_KEY, data.value.toString());
        return data.value;
      }
    }
  } catch (err) {
    // Primary failed, proceed to backup
  }

  // 2. Try backup counter (CountAPI)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKUP_COUNTER_URL}/api/v1/get/${COMBINED_KEY}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        localStorage.setItem(CACHE_KEY, data.value.toString());
        return data.value;
      }
    }
  } catch (err) {
    // Backup failed, proceed to cache
  }

  // 3. Fallback to cached count
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return parseInt(cached, 10) || 0;
    }
  } catch (e) {}

  return 0;
}

export async function incrementGlobalHearts(): Promise<number> {
  let newValue: number | null = null;

  // 1. Hit primary counter
  try {
    const res = await fetch(`${PRIMARY_COUNTER_URL}/hit/${NAMESPACE}/${KEY}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        const val: number = data.value;
        newValue = val;
        localStorage.setItem(CACHE_KEY, val.toString());
      }
    }
  } catch (err) {
    // Continue to backup
  }

  // 2. Also hit backup counter in background to keep in sync
  try {
    fetch(`${BACKUP_COUNTER_URL}/api/v1/hit/${COMBINED_KEY}`, {
      headers: { 'Accept': 'application/json' }
    }).catch(() => {});
  } catch (e) {}

  // If primary succeeded, return its new value
  if (newValue !== null) {
    return newValue;
  }

  // 3. Fallback to optimistic local increment if offline
  try {
    const cached = parseInt(localStorage.getItem(CACHE_KEY) || '0', 10);
    const optimistic = cached + 1;
    localStorage.setItem(CACHE_KEY, optimistic.toString());
    return optimistic;
  } catch (e) {
    return 1;
  }
}
