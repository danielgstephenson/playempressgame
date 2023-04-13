import { Scheme } from "../types"
import guardDefined from "./defined"

export default function guardHandScheme ({ hand, schemeId }: {
  hand: Scheme[],
  schemeId: string
}): Scheme {
  const scheme = hand.find((scheme) => scheme.id === schemeId)
  return guardDefined(scheme, 'Scheme')
}