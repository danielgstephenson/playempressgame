import { Scheme, SchemeRef } from '../types'
import serializeScheme from './scheme'

export default function serializeSchemes (schemes: Scheme[]): SchemeRef[] {
  const refs = schemes.map(serializeScheme)
  return refs
}
