import guardSchemeData from '../guard/schemeData'
import { Scheme } from '../types'

export default function getSchemes (schemeRefs: Scheme[]): Scheme[] {
  const schemes = schemeRefs.map((ref) => {
    const playScheme = guardSchemeData(ref.rank)
    return { ...ref, ...playScheme }
  })
  return schemes
}
