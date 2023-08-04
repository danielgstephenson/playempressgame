import { UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, SetStateAction } from 'react'
import { Identified, Scheme } from '../types'
import filterOld from './filterOld'
import move from './move'

export default function activeOver <Element extends Identified> ({
  active,
  getSchemeById,
  old,
  over,
  overArea,
  overNew,
  overOld,
  setOld,
  setNew,
  take
}: {
  active: Element
  getSchemeById: (id?: UniqueIdentifier) => Scheme | undefined
  old: Element[]
  overArea: boolean
  overNew: boolean
  overOld: boolean
  over: Identified
  setOld?: Dispatch<SetStateAction<Element[]>>
  setNew?: Dispatch<SetStateAction<Element[]>>
  take?: (schemeId: string) => void
}): void {
  if (overOld) {
    return setOld?.(currentOld => {
      return filterOld({ currentOld, old, active })
    })
  }
  if (overArea) {
    setOld?.((current) => current.filter((scheme) => scheme.id !== active.id))
    setNew?.((current) => {
      const added = [...current, active]
      added.sort((a, b) => {
        const aScheme = getSchemeById(a.id)
        if (aScheme == null) throw new Error(`Scheme not found: ${a.id}`)
        const bScheme = getSchemeById(b.id)
        if (bScheme == null) throw new Error(`Scheme not found: ${b.id}`)
        return bScheme.rank - aScheme.rank
      })
      return added
    })
  }
  if (overNew) {
    take?.(String(active.id))
    move({
      active,
      getSchemeById,
      setOld,
      setNew,
      over
    })
  }
}
