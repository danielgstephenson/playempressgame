import { Button, ButtonProps } from '@chakra-ui/react'
import { WriterComponentProps } from '../types'
import ChakraIcon from './Icon'

export default function ChakraButton ({
  onClick,
  label,
  loading,
  error,
  ...buttonProps
}: WriterComponentProps & ButtonProps): JSX.Element {
  return (
    <Button onClick={onClick} isDisabled={loading} {...buttonProps}>
      {label}!!!
      <ChakraIcon loading={loading} error={error} />
    </Button>
  )
}
