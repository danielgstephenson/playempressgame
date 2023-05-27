import { useContext } from 'react'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { playerContext } from '../reader/player'
import { Scheme } from '../types'
import Curtain from './Curtain'
import StatusView from './Status'

export default function TableauView ({
  scheme,
  onReturn,
  label
}: {
  scheme?: Scheme
  onReturn?: () => void
  label: string
}): JSX.Element {
  const playerState = useContext(playerContext)
  const showAction = scheme != null && playerState.ready !== true
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
