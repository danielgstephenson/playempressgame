import guardSchemeData from './schemeData'
import guardSchemeRef from './schemeRef'
import { Scheme, SchemeRef } from '../types'

export default function guardScheme ({ rank, ref }: { rank?: number, ref?: SchemeRef }): Scheme {
  const schemeRef = guardSchemeRef({ rank, ref })
  const data = guardSchemeData(schemeRef.rank)
  return { ...schemeRef, ...data }
}
