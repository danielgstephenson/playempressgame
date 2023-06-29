import { arrayMove } from '@dnd-kit/sortable'
import { Identified } from '../types'

export default function reorder <Element extends Identified> ({
  a, b, current
}: {
  a: Identified
  b: Identified
  current: Element[]
}): Element[] {
  const oldIndex = current.findIndex(item => item.id === a.id)
  const newIndex = current.findIndex(scheme => scheme.id === b.id)
  const moved = arrayMove(current, oldIndex, newIndex)
  return moved
}
