import { Scheme, SchemeRef } from '../types'
import guardScheme from './scheme'

export default function guardSchemes ({ ranks, refs }: {
  ranks?: number[] | undefined
  refs?: SchemeRef[] | undefined
}): Scheme[] {
  if (refs == null) {
    if (ranks == null) {
      throw new Error('No ranks or refs provided to guardSchemes')
    }
    const schemes = ranks.map(rank => guardScheme({ rank }))
    return schemes
  }
  const schemes = refs.map(ref => guardScheme({ ref }))
  return schemes
}
