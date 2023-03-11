import { Safe } from './types'

export default function getSafe <Requirements extends {}, Output> ({
  requirements,
  getter
}: {
  requirements: Requirements
  getter: (props: Safe<Requirements>) => Output
}): Output | undefined {
  function hasAllValues (props: Requirements): props is Safe<Requirements> {
    const values = Object.values(props)
    const hasAllValues = values.every((value) => value != null)
    return hasAllValues
  }
  if (!hasAllValues(requirements)) return undefined
  const query = getter(requirements)
  return query
}
