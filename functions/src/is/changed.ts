import { SchemeRef } from '../types'

export default function isChanged (a: SchemeRef[], b: SchemeRef[]): boolean {
  if (a.length !== b.length) {
    return true
  }
  const changedId = a.some((scheme, index) => scheme.id !== b[index]?.id)
  return changedId
}
