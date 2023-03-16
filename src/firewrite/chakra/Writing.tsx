import { Button, Spinner } from '@chakra-ui/react'
import { WritingProps } from '../types'
import ChakraWarning from './Warning'

export default function ChakraWriting ({
  write,
  label,
  loading,
  error
}: WritingProps): JSX.Element {
  const loadingView = loading && <Spinner ml='10px' />
  return (
    <Button onClick={write} isDisabled={loading}>
      {label}
      {loadingView}
      <ChakraWarning error={error} />
    </Button>
  )
}
