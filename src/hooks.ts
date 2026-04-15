import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ── IndexedDB helpers ──────────────────────────────────────────────────────────

const DB_NAME = 'tedx-pwa'
const DB_VERSION = 1
const STORE = 'kv'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function idbGet<T>(db: IDBDatabase, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => resolve(req.result as T | undefined)
    req.onerror = () => reject(req.error)
  })
}

function idbSet(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// ── usePersistentState ─────────────────────────────────────────────────────────
// Drop-in replacement for useState backed by IndexedDB.
// Migrates existing localStorage data on first run.

export function usePersistentState<T>(key: string, fallback: T) {
  const [state, setStateRaw] = useState<T>(fallback)
  const dbRef = useRef<IDBDatabase | null>(null)

  // Open DB, migrate from localStorage if needed, load persisted value
  useEffect(() => {
    let cancelled = false
    openDB()
      .then(async (db) => {
        if (cancelled) return
        dbRef.current = db

        let loaded: T | undefined = await idbGet<T>(db, key)

        if (loaded === undefined) {
          // One-time migration from old localStorage key
          try {
            const raw = window.localStorage.getItem(key)
            if (raw) {
              loaded = JSON.parse(raw) as T
              await idbSet(db, key, loaded)
              window.localStorage.removeItem(key)
            }
          } catch {
            // ignore
          }
        }

        if (!cancelled && loaded !== undefined) {
          setStateRaw(loaded)
        }
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const setState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setStateRaw((prev) => {
        const next =
          typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
        if (dbRef.current) {
          idbSet(dbRef.current, key, next).catch(console.error)
        }
        return next
      })
    },
    [key],
  )

  return [state, setState] as const
}

// ── useNow ─────────────────────────────────────────────────────────────────────

export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  return useMemo(() => now, [now])
}
