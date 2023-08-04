import { Identified } from '../types'

export default function filterOld <Element extends Identified> ({ currentOld, old, active }: {
  currentOld: Element[]
  old: Element[]
  active: Element
}): Element[] {
  const newIds = [...currentOld.map(scheme => scheme.id), active.id]
  return old.filter(element => newIds.includes(element.id))
}
