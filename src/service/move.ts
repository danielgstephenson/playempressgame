import { UniqueIdentifier } from '@dnd-kit/core'
import { Dispatch, SetStateAction } from 'react'
import { Identified, Scheme } from '../types'

export default function move <Element extends Identified> ({
  active,
  getSchemeById,
  over,
  setOld,
  setNew
}: {
  active: Element
  getSchemeById: (id?: UniqueIdentifier) => Scheme | undefined
  over: Identified
  setOld?: Dispatch<SetStateAction<Element[]>>
  setNew?: Dispatch<SetStateAction<Element[]>>
}): void {
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
