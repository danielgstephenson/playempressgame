type Safe<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
}

export default function getSafe <Needs extends {}, Output> ({
  needs,
  getter
}: {
  needs: Needs
  getter: (props: Safe<Needs>) => Output
}): Output | undefined {
  function hasAllProps (props: Needs): props is Safe<Needs> {
    const values = Object.values(props)
    const hasAllValues = values.every((value) => value != null)
    return hasAllValues
  }
  if (!hasAllProps(needs)) return undefined
  const query = getter(needs)
  return query
}
