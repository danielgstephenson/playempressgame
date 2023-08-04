import { UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, SetStateAction } from 'react'
import { Identified, Scheme } from '../types'
import move from './move'
import reorder from './reorder'

export default function activeOver <Element extends Identified> ({
  active,
  getSchemeById,
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
  overArea: boolean
  overNew: boolean
  overOld: boolean
  over: Identified
  setOld?: Dispatch<SetStateAction<Element[]>>
  setNew?: Dispatch<SetStateAction<Element[]>>
  take?: (schemeId: string) => void
}): void {
  if (overOld) {
    setOld?.((current) => reorder({ a: active, b: over, current }))
  }
  if (overArea) {
    setOld?.((current) => current.filter((scheme) => scheme.id !== active.id))
    setNew?.((current) => {
      console.log('setNew current', current)
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
