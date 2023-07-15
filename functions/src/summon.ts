import { Scheme } from './types'

export default function summon ({
  court,
  scheme
}: {
  court: Scheme[]
  scheme: Scheme
}): void {
  court.push(scheme)
}
