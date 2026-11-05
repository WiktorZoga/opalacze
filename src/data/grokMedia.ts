import { useEffect, useState } from 'react'
import { assetUrl } from './memes'

export interface GrokMedia {
  id: string
  file: string
  kind: 'image' | 'video'
  node: string
  caption?: string
  captionBaked?: boolean
  aspectRatio?: string
  durationSeconds?: number
  prompt?: string
  model?: string
  generatedAt?: string
  /** resolved URL under the app's base path */
  url: string
}

const INDEX_URL = `${import.meta.env.BASE_URL}memes/grok/index.json`

let cache: Promise<GrokMedia[]> | null = null

function load(): Promise<GrokMedia[]> {
  cache ??= fetch(INDEX_URL, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : { items: [] }))
    .then((raw: { items?: Omit<GrokMedia, 'url'>[] } | Omit<GrokMedia, 'url'>[]) => {
      const list = Array.isArray(raw) ? raw : (raw.items ?? [])
      return list.map((m) => {
        const file = m.file.startsWith('/') ? m.file : `/memes/grok/${m.file}`
        return { ...m, kind: m.kind ?? (/\.(mp4|webm|mov)$/i.test(file) ? 'video' : 'image'), url: assetUrl(file) }
      })
    })
    .catch(() => [])
  return cache
}

export interface GrokLibrary {
  items: GrokMedia[]
  byId: (id: string) => GrokMedia | undefined
  byNode: (node: string, kind?: 'image' | 'video') => GrokMedia | undefined
  /** caption to overlay on media whose caption is not baked in */
  captionFor: (m: GrokMedia) => string | undefined
}

/** Grok Imagine renders listed in public/memes/grok/index.json; empty until the files land */
export function useGrokMedia(): GrokLibrary {
  const [items, setItems] = useState<GrokMedia[]>([])
  useEffect(() => {
    let alive = true
    load().then((m) => alive && setItems(m))
    return () => {
      alive = false
    }
  }, [])
  const byId = (id: string) => items.find((m) => m.id === id)
  const byNode = (node: string, kind?: 'image' | 'video') => items.find((m) => m.node === node && (!kind || m.kind === kind))
  const captionFor = (m: GrokMedia) => (m.captionBaked ? undefined : (m.caption ?? items.find((x) => x.node === m.node && x.caption)?.caption))
  return { items, byId, byNode, captionFor }
}
