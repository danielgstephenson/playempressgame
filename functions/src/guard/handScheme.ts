import { Scheme } from '../types'
import guardDefined from './defined'

export default function guardHandScheme ({ hand, schemeId, label }: {
  hand: Scheme[]
  schemeId: string | undefined
  label: string
}): Scheme {
  const idLabel = `${label} ID`
  const id = guardDefined(schemeId, idLabel)
  const scheme = hand.find((scheme) => scheme.id === id)
  return guardDefined(scheme, label)
}
