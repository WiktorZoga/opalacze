import { useEffect, useState } from 'react'

export interface GrokMedia {
  id: string
  file: string
  kind: 'image' | 'video'
  prompt?: string
  model?: string
  generatedAt?: string
  /** resolved URL under the app's base path */
  url: string
}

const INDEX_URL = `${import.meta.env.BASE_URL}memes/grok/index.json`

let cache: Promise<Record<string, GrokMedia>> | null = null

function load(): Promise<Record<string, GrokMedia>> {
  cache ??= fetch(INDEX_URL, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : []))
    .then((items: Omit<GrokMedia, 'url'>[] | { items?: Omit<GrokMedia, 'url'>[] }) => {
      const list = Array.isArray(items) ? items : (items.items ?? [])
      return Object.fromEntries(
        list.map((m) => {
          const file = m.file.replace(/^\/?(memes\/grok\/)?/, '')
          const kind = m.kind ?? (/\.(mp4|webm|mov)$/i.test(file) ? 'video' : 'image')
          return [m.id, { ...m, kind, url: `${import.meta.env.BASE_URL}memes/grok/${file}` }]
        }),
      )
    })
    .catch(() => ({}))
  return cache
}

/** Grok Imagine renders listed in public/memes/grok/index.json; empty until the files land */
export function useGrokMedia() {
  const [media, setMedia] = useState<Record<string, GrokMedia>>({})
  useEffect(() => {
    let alive = true
    load().then((m) => alive && setMedia(m))
    return () => {
      alive = false
    }
  }, [])
  return media
}
