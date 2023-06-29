import { Identified } from '../types'

export default function add <Element extends Identified> ({
  active,
  current,
  over
}: {
  active: Element
  current: Element[]
  over: Identified
}): Element[] {
  const overIndex = current.findIndex((scheme) => scheme.id === over.id)
  const beforeIndex = current.slice(0, overIndex)
  const afterIndex = current.slice(overIndex)
  const added = [...beforeIndex, active, ...afterIndex]
  return added
}
