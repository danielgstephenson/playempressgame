import { Button, Spinner } from '@chakra-ui/react'
import { WriteProps } from '../types'
import ChakraWarning from './Warning'

export default function ChakraWrite ({
  write,
  label,
  loading,
  error
}: WriteProps): JSX.Element {
  const loadingView = loading && <Spinner ml='10px' />
  return (
    <Button onClick={write} isDisabled={loading}>
      {label}
      {loadingView}
      <ChakraWarning error={error} />
    </Button>
  )
}
