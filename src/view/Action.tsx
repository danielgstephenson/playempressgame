import { Button } from '@chakra-ui/react'
import LoadingView from './Loading'
import WarningView from './Warning'

export default function ActionView (props: {
  label: string
  action: () => void
  loading: boolean
  error?: Error
}): JSX.Element {
  function handleClick (): void { props.action() }
  return (
    <Button onClick={handleClick} isDisabled={props.loading}>
      {props.label}
      <LoadingView loading={props.loading} />
      <WarningView error={props.error} />
    </Button>
  )
}
