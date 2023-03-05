import { Alert, AlertIcon, Spinner } from '@chakra-ui/react'
import { FC } from 'react'

export default function DocViewer <T> ({
  stream,
  View
}: {
  stream: [T | undefined, boolean, Error | undefined, unknown]
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
  return <View {...data} />
}
