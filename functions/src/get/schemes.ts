import guardSchemeData from '../guard/schemeData'
import { Scheme, SchemeRef } from '../types'

export default function getSchemes (schemeRefs: SchemeRef[]): Scheme[] {
  const schemes = schemeRefs.map((ref) => {
    const playScheme = guardSchemeData(ref.rank)
    return { ...ref, ...playScheme }
  })
  return schemes
}
