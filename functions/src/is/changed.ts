import { Scheme } from '../types'

export default function isChanged (a: Scheme[], b: Scheme[]): boolean {
  if (a.length !== b.length) {
    return true
  }
  const changedId = a.some((scheme, index) => scheme.id !== b[index]?.id)
  return changedId
}
