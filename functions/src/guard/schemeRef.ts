import createSchemeRef from '../create/schemeRef'
import { SchemeRef } from '../types'

export default function guardSchemeRef ({ rank, ref }: {
  rank: number | undefined
  ref: SchemeRef | undefined
}): SchemeRef {
  if (ref == null) {
    if (rank == null) {
      throw new Error('No rank or ref provided to guardScheme')
    }
    return createSchemeRef(rank)
  } else {
    return ref
  }
}
