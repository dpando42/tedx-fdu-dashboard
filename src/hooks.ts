import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase, STATE_ROW_ID } from './lib/supabase'

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

// ── Types ──────────────────────────────────────────────────────────────────────

interface StoredEntry<T> {
  data: T
  ts: string // ISO timestamp — used for last-write-wins reconciliation
}

// ── usePersistentState ─────────────────────────────────────────────────────────
// Backed by IndexedDB (offline) + Supabase (cross-device sync + realtime).
// Strategy: last-write-wins by timestamp. IDB is the offline cache; Supabase
// is the source of truth when online. Realtime subscription pushes changes
// from other devices instantly.

export function usePersistentState<T>(key: string, fallback: T) {
  const [state, setStateRaw] = useState<T>(fallback)
  const dbRef = useRef<IDBDatabase | null>(null)
  const tsRef = useRef<string>(new Date(0).toISOString()) // timestamp of current state

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      // ── 1. Open IndexedDB ──────────────────────────────────────────────────
      const db = await openDB()
      if (cancelled) return
      dbRef.current = db

      // ── 2. Load from IDB (instant — appears before network) ───────────────
      let entry = await idbGet<StoredEntry<T>>(db, key)

      if (entry === undefined) {
        // One-time migration: raw value (old format) or localStorage
        try {
          const raw = await idbGet<T>(db, key) // old raw format
          if (raw !== undefined && typeof raw === 'object' && !('data' in (raw as object))) {
            entry = { data: raw, ts: new Date(0).toISOString() }
          }
        } catch { /* ignore */ }

        if (entry === undefined) {
          try {
            const ls = window.localStorage.getItem(key)
            if (ls) {
              entry = { data: JSON.parse(ls) as T, ts: new Date(0).toISOString() }
              window.localStorage.removeItem(key)
            }
          } catch { /* ignore */ }
        }
      }

      if (entry !== undefined && !cancelled) {
        setStateRaw(entry.data)
        tsRef.current = entry.ts
        await idbSet(db, key, entry)
      }

      // ── 3. Fetch from Supabase (source of truth when online) ──────────────
      try {
        const { data: remote, error } = await supabase
          .from('tedx_state')
          .select('data, updated_at')
          .eq('id', STATE_ROW_ID)
          .single()

        if (!error && remote && !cancelled) {
          const remoteTs = remote.updated_at as string
          if (remoteTs > tsRef.current) {
            // Remote is newer — use it
            const remoteData = remote.data as T
            setStateRaw(remoteData)
            tsRef.current = remoteTs
            await idbSet(db, key, { data: remoteData, ts: remoteTs } satisfies StoredEntry<T>)
          } else if (tsRef.current > new Date(0).toISOString() && entry !== undefined) {
            // Local is newer — push to Supabase
            await supabase
              .from('tedx_state')
              .upsert({ id: STATE_ROW_ID, data: entry.data, updated_at: tsRef.current })
          }
        }
      } catch { /* offline — IDB data is fine */ }

      // ── 4. Subscribe to realtime changes (other devices) ──────────────────
      const channel = supabase
        .channel('tedx_state_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tedx_state', filter: `id=eq.${STATE_ROW_ID}` },
          async (payload) => {
            if (cancelled) return
            const row = payload.new as { data: T; updated_at: string } | undefined
            if (!row) return
            // Only apply if genuinely newer (ignore echoes of our own writes)
            if (row.updated_at > tsRef.current) {
              tsRef.current = row.updated_at
              setStateRaw(row.data)
              if (dbRef.current) {
                await idbSet(dbRef.current, key, { data: row.data, ts: row.updated_at } satisfies StoredEntry<T>)
              }
            }
          },
        )
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }

    const cleanup = init().catch(console.error)

    return () => {
      cancelled = true
      cleanup?.then((fn) => fn?.())
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── setState: write locally first, then sync ───────────────────────────────
  const setState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setStateRaw((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater
        const ts = new Date().toISOString()
        tsRef.current = ts

        // IDB — immediate, non-blocking
        if (dbRef.current) {
          idbSet(dbRef.current, key, { data: next, ts } satisfies StoredEntry<T>).catch(console.error)
        }

        // Supabase — async, non-blocking, silently fails offline
        supabase
          .from('tedx_state')
          .upsert({ id: STATE_ROW_ID, data: next, updated_at: ts })
          .then(({ error }) => { if (error) console.warn('Supabase sync:', error.message) })

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
