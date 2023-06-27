import { Active, Over } from '@dnd-kit/core'
import { Scheme } from '../types'

export default function dragReturn ({
  active,
  append = true,
  over,
  overScheme,
  hand,
  handClone
}: {
  active: Active
  append?: boolean
  over: Over
  overScheme: boolean
  hand: Scheme[]
  handClone: Scheme[] | undefined
}): Scheme[] {
  console.log('hand', JSON.stringify(hand))
  const filtered = hand.filter((scheme) => scheme.id !== active.id)
  if (overScheme) {
    if (hand.some(scheme => scheme.id === over.id)) {
      return filtered
    }
    const cloneScheme = handClone?.find((scheme) => scheme.id === over.id)
    if (cloneScheme == null) {
      throw new Error('Trash scheme is not in hand')
    }
    const handIndex = hand.findIndex((scheme) => scheme.id === active.id)
    if (handIndex > -1) {
      const before = hand.slice(0, handIndex)
      const after = hand.slice(handIndex)
      return [...before, cloneScheme, ...after]
    }
    if (append) {
      return [...filtered, cloneScheme]
    }
    return [cloneScheme, ...filtered]
  }
  return filtered
}
