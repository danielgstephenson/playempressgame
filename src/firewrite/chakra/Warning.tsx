import { WarningIcon } from '@chakra-ui/icons'
import { Tooltip } from '@chakra-ui/react'

export default function ChakraWarning ({ error }: { error?: Error}): JSX.Element {
  if (error != null) {
    return (
      <Tooltip label={error.message} aria-label={error.message}>
        <WarningIcon ml='10px' color='red.500' />
      </Tooltip>
    )
  }
  return <></>
}
