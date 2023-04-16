import { Scheme, SchemeRef } from '../types'
import guardDefined from './defined'
import guardSchemeData from './schemeData'

export default function guardHandScheme ({ hand, schemeId, label }: {
  hand: SchemeRef[]
  schemeId: string | undefined
  label: string
}): Scheme {
  const idLabel = `${label} ID`
  const id = guardDefined(schemeId, idLabel)
  const handRef = hand.find((scheme) => scheme.id === id)
  const schemeRef = guardDefined(handRef, label)
  const schemeData = guardSchemeData(schemeRef.rank)
  return {
    ...schemeRef,
    ...schemeData
  }
}
