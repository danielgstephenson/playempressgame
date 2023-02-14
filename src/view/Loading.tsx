import { Spinner } from '@chakra-ui/react'

export default function LoadingView ({ loading }: { loading: boolean}): JSX.Element {
  if (loading) return <Spinner ml='10px' />
  return <></>
}
