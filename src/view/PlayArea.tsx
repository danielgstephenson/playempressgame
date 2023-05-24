import ChakraButton from '../lib/firewrite/chakra/Button'
import { Scheme } from '../types'
import Curtain from './Curtain'
import StatusView from './Status'

export default function PlayAreaView ({
  scheme,
  onReturn,
  label
}: {
  scheme?: Scheme
  onReturn?: () => void
  label: string
}): JSX.Element {
  const showAction = scheme != null
  return (
    <>
      <StatusView
        label={label}
        value={scheme?.rank}
      />
      <Curtain open={showAction}>
        <ChakraButton
          label='Return to hand'
          onClick={onReturn}
        />
      </Curtain>
    </>
  )
}
