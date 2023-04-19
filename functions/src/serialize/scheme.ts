import { Scheme, SchemeRef } from '../types'

export default function serializeScheme (scheme: Scheme): SchemeRef {
  const ref = { id: scheme.id, rank: scheme.rank }
  return ref
}
