import { Scheme, Scheme } from '../types'

export default function serializeScheme (scheme: Scheme | Scheme): Scheme {
  const ref = { id: scheme.id, rank: scheme.rank }
  return ref
}
