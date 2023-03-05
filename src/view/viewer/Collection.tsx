import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { FC } from 'react'
import { Doc } from '../../types'

export default function CollectionViewer <T extends Doc> ({
  stream,
  View
}: {
  stream: [T[] | undefined, boolean, Error | undefined, unknown]
  View: FC<T>
}): JSX.Element {
  const [data, loading, error] = stream
  if (loading) {
    return <Spinner />
  }
  if (error != null) {
    return <Alert status='error'> <AlertIcon /> {error.message}</Alert>
  }
  if (data == null) {
    return <></>
  }
  if (data.length === 0) {
    return <Alert status='info'><AlertIcon />No Data</Alert>
  }
  if (data.length === 0) {
    return <Alert status='info'><AlertIcon />No Data</Alert>
  }
  const items = data.map(datum => (
    <View
      key={datum.id}
      {...datum}
    />
  ))
  return <>{items}</>
}
