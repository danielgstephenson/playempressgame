import { Dispatch, SetStateAction } from 'react'
import { Identified } from '../types'
import add from './add'

export default function move <Element extends Identified> ({
  active,
  over,
  setOld,
  setNew
}: {
  active: Element
  over: Identified
  setOld?: Dispatch<SetStateAction<Element[]>>
  setNew?: Dispatch<SetStateAction<Element[]>>
}): void {
  setOld?.((current) => current.filter((scheme) => scheme.id !== active.id))
  setNew?.((current) => {
    return add({
      active,
      current,
      over
    })
  })
}
