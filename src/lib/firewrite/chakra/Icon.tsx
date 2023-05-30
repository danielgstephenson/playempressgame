import { WarningIcon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/react'

export default function ChakraIcon ({ loading, error, errorMessage }: {
  loading?: boolean
  error?: Error
  errorMessage?: string
}): JSX.Element {
  if (error == null) {
    return <></>
  }
  const message = errorMessage ?? error.message
  return (
    <Tooltip label={message} aria-label={error.message}>
      <WarningIcon ml='10px' color='red.500' />
    </Tooltip>
  )
}
