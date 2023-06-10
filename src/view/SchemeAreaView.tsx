import { useContext } from 'react'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import { Scheme } from '../types'
import Curtain from './Curtain'
import StatusView from './Status'

export default function SchemeAreaView ({
  scheme,
  onReturn,
  label
}: {
  scheme?: Scheme
  onReturn?: () => void
  label: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const showAction = scheme != null && playerState.playReady !== true && gameState.phase === 'play'
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
