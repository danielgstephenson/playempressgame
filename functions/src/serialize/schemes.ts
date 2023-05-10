import { Scheme, Scheme } from '../types'
import serializeScheme from './scheme'

export default function serializeSchemes (schemes: Scheme[] | Scheme[]): Scheme[] {
  const refs = schemes.map(serializeScheme)
  return refs
}
