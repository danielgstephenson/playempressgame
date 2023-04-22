import { Scheme, SchemeRef } from '../types'
import serializeScheme from './scheme'

export default function serializeSchemes (schemes: Scheme[] | SchemeRef[]): SchemeRef[] {
  const refs = schemes.map(serializeScheme)
  return refs
}
