import { Dispatch, SetStateAction } from 'react'
import { Identified } from '../types'
import move from './move'
import reorder from './reorder'

export default function activeOver <Element extends Identified> ({
  active,
  over,
  overArea,
  overNew,
  overOld,
  setOld,
  setNew,
  take
}: {
  active: Element
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
    setNew?.([active])
  }
  if (overNew) {
    take?.(String(active.id))
    move({
      active,
      setOld,
      setNew,
      over
    })
  }
}
