import getJoinedRanks from '../../get/joined/ranks'
import { Scheme } from '../../types'

export default function createBeforeMessage ({
  prefix,
  schemes
}: {
  prefix: string
  schemes: Scheme[]
}): string {
  const joined = getJoinedRanks(schemes)
  const message = `${prefix} was ${joined}.`
  return message
}
