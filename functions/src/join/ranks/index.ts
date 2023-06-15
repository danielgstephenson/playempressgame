import { Scheme } from '../../types'
import join from '..'

export default function joinRanks (schemes: Scheme[], empty: string = 'empty'): string {
  if (schemes.length === 0) {
    return empty
  }
  const copy = [...schemes]
  const ranks = copy.map(scheme => scheme.rank)
  return join(ranks)
}
