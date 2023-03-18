import { WarningIcon } from '@chakra-ui/icons'
import { Spinner, Tooltip } from '@chakra-ui/react'

export default function ChakraIcon ({ loading, error }: { loading: boolean, error?: Error}): JSX.Element {
  if (loading) {
    return <Spinner ml='1em' />
  }
  if (error == null) {
    return <></>
  }
  return (
    <Tooltip label={error.message} aria-label={error.message}>
      <WarningIcon ml='10px' color='red.500' />
    </Tooltip>
  )
}
