import { Spinner, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Doc } from '../types'

export default function Viewer <T extends Doc> ({
  stream,
  View
}: {
  stream: [T | T[] | undefined, boolean, Error | undefined, unknown]
  View: FC<T>
}): JSX.Element {
  const [data, loading, error] = stream
  if (loading) {
    return <Spinner />
  }
  if (error != null) {
    return <Text>{error.message}</Text>
  }
  if (data == null) {
    throw new Error('Loaded data is undefined')
  }
  if (Array.isArray(data)) {
    const items = data.map(datum => (
      <View
        key={datum.id}
        {...datum}
      />
    ))

    return <>{items}</>
  }
  return <View {...data} />
}
