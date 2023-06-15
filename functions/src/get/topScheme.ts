import guardDefined from '../guard/defined'
import { Scheme } from '../types'

export default function getTopScheme (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) {
    return undefined
  }
  const topScheme = guardDefined(schemes[0], 'Top scheme')
  return topScheme
}
