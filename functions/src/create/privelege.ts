import { createSchemeRef } from './schemeRef'
import { SchemeRef } from '../types'

export default function takePrivelege (count: number): SchemeRef[] {
  const schemes = new Array(count).fill(0).map((_, i) => {
    return createSchemeRef(1)
  })
  return schemes
}
