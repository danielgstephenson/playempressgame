import getJoinedRanks from '../../get/joined/ranks'
import { Scheme } from '../../types'

export default function createAfterMessage ({
  prefix,
  schemes
}: {
  prefix: string
  schemes: Scheme[]
}): string {
  const joined = getJoinedRanks(schemes)
  const message = `${prefix} becomes ${joined}.`
  return message
}
