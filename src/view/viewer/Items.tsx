import { FC } from 'react'
import { Doc } from '../../types'

export default function ViewerItems <T extends Doc> ({
  data,
  View
}: {
  data: T[]
  View: FC<T>
}): JSX.Element {
  const items = data.map(datum => (
    <View
      key={datum.id}
      {...datum}
    />
  ))

  return <>{items}</>
}
