import { Active } from '@dnd-kit/core'
import { Scheme } from '../types'

export default function dragReturn ({
  active,
  hand
}: {
  active: Active
  hand: Scheme[]
}): Scheme[] {
  const filtered = hand.filter((scheme) => scheme.id !== active.id)
  return filtered
}
