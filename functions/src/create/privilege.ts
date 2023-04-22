import guardScheme from '../guard/scheme'
import { Scheme } from '../types'

export default function createPrivilege (count: number): Scheme[] {
  const schemes = new Array(count).fill(0).map((_, i) => {
    return guardScheme({ rank: 1 })
  })
  return schemes
}
