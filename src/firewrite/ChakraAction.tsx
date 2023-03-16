import { Button, Spinner } from '@chakra-ui/react'
import WarningView from '../view/Warning'

export default function ChakraAction ({
  action,
  label,
  loading,
  error
}: {
  action: () => void
  label: string
  loading: boolean
  error?: Error
}): JSX.Element {
  const loadingView = loading && <Spinner ml='10px' />
  return (
    <Button onClick={action} isDisabled={loading}>
      {label}
      {loadingView}
      <WarningView error={error} />
    </Button>
  )
}
