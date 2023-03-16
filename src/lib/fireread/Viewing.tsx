import { ViewAndProps } from './types'

export default function Viewing <Props> ({ View, ...props }: ViewAndProps<Props>): JSX.Element {
  if (View == null) return <></>
  return <View {...props} />
}
