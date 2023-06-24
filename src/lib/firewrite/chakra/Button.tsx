import { Button, ButtonProps } from '@chakra-ui/react'
import { WriterComponentProps } from '../types'
import ChakraIcon from './Icon'

export default function ChakraButton ({
  children,
  onClick,
  loading,
  error,
  errorMessage,
  ...buttonProps
}: WriterComponentProps & ButtonProps): JSX.Element {
  return (
    <Button size='sm' onClick={onClick} isLoading={loading} {...buttonProps}>
      {children}
      <ChakraIcon loading={loading} error={error} errorMessage={errorMessage} />
    </Button>
  )
}
