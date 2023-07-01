import { Button, ButtonGroup, ButtonProps, IconButton, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import { WriterComponentProps } from '../types'
import { WarningIcon } from '@chakra-ui/icons'

export default function ChakraButton ({
  children,
  onClick,
  loading,
  error,
  errorMessage,
  ...buttonProps
}: WriterComponentProps & ButtonProps): JSX.Element {
  const message = errorMessage ?? error?.message ?? 'Error'
  const errorButton = error != null && (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label={message} bg='red.800' color='white' icon={<WarningIcon />} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{message}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
  return (
    <ButtonGroup size='sm' isAttached>
      <Button onClick={onClick} isLoading={loading} {...buttonProps}>
        {children}
      </Button>
      {errorButton}
    </ButtonGroup>
  )
}
