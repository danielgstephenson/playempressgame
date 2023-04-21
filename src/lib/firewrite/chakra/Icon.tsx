import { WarningIcon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/react'

export default function ChakraIcon ({ loading, error }: { loading: boolean, error?: Error}): JSX.Element {
  if (error == null) {
    return <></>
  }
  return (
    <Tooltip label={error.message} aria-label={error.message}>
      <WarningIcon ml='10px' color='red.500' />
    </Tooltip>
  )
}
