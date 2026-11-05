import type { ReactNode } from 'react'
import { Radar } from './Radar'
import { GenomeLab } from './GenomeLab'
import { Breeding } from './Breeding'
import { Studio } from './Studio'
import { Publish } from './Publish'
import { FamilyTree } from './FamilyTree'
import { Brandrot } from './Brandrot'

export interface ScreenDef {
  id: string
  label: string
  /** pipeline node highlighted while this screen is open (0 scout … 5 analyst) */
  stage: number
  render: (opts: { demo: boolean }) => ReactNode
}

/** Nav + router. Add a screen by appending one entry; number keys follow this order. */
export const SCREENS: ScreenDef[] = [
  { id: 'radar', label: 'RADAR', stage: 0, render: () => <Radar /> },
  { id: 'genome', label: 'GENOME', stage: 1, render: () => <GenomeLab /> },
  { id: 'breed', label: 'BREED', stage: 2, render: () => <Breeding /> },
  { id: 'studio', label: 'STUDIO', stage: 3, render: () => <Studio /> },
  { id: 'publish', label: 'PUBLISH', stage: 4, render: () => <Publish /> },
  { id: 'tree', label: 'TREE', stage: 5, render: () => <FamilyTree /> },
  { id: 'brand', label: 'BRANDROT', stage: 2, render: ({ demo }) => <Brandrot finaleAt={demo ? 2600 : undefined} /> },
]
