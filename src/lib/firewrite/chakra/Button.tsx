import { Button, ButtonProps } from '@chakra-ui/react'
import { WriterComponentProps } from '../types'
import ChakraIcon from './Icon'

export default function ChakraButton ({
  onClick,
  label,
  loading,
  error,
  errorMessage,
  ...buttonProps
}: WriterComponentProps & ButtonProps): JSX.Element {
  return (
    <Button onClick={onClick} isLoading={loading} {...buttonProps}>
      {label}
      <ChakraIcon loading={loading} error={error} errorMessage={errorMessage} />
    </Button>
  )
}
