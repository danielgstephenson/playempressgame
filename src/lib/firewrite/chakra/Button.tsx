import { Button } from '@chakra-ui/react'
import { WriterComponentProps } from '../types'
import ChakraIcon from './Icon'

export default function ChakraButton ({
  onClick,
  label,
  loading,
  error
}: WriterComponentProps): JSX.Element {
  return (
    <Button onClick={onClick} isDisabled={loading}>
      {label}
      <ChakraIcon loading={loading} error={error} />
    </Button>
  )
}
