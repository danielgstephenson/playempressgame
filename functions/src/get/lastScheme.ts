import guardDefined from '../guard/defined'
import { Scheme } from '../types'

export default function getLastScheme (schemes: Scheme[]): Scheme | undefined {
  if (schemes.length === 0) {
    return undefined
  }
  const topScheme = guardDefined(schemes[schemes.length - 1], 'Last scheme')
  return topScheme
}
