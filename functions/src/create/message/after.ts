import joinRanks from '../../join/ranks'
import { Scheme } from '../../types'

export default function createAfterMessage ({
  prefix,
  schemes
}: {
  prefix: string
  schemes: Scheme[]
}): string {
  const joined = joinRanks(schemes)
  const message = `${prefix} becomes ${joined}.`
  return message
}
