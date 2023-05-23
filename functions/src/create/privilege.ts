import { Scheme } from '../types'
import createScheme from './scheme'

export default function createPrivilege (count: number): Scheme[] {
  const schemes = new Array(count).fill(0).map((_, i) => {
    return createScheme(1)
  })
  return schemes
}
