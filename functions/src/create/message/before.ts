import joinRanks from '../../join/ranks'
import { Scheme } from '../../types'

export default function createBeforeMessage ({
  prefix,
  schemes
}: {
  prefix: string
  schemes: Scheme[]
}): string {
  const joined = joinRanks(schemes)
  const message = `${prefix} was ${joined}.`
  return message
}
