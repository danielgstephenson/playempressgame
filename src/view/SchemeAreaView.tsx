import { useContext } from 'react'
import ChakraButton from '../lib/firewrite/chakra/Button'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Curtain from './Curtain'
import StatusView from './Status'

export default function SchemeAreaView ({
  schemeId,
  onReturn,
  label
}: {
  schemeId?: string
  onReturn?: () => void
  label: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const showAction = schemeId != null && playerState.playReady !== true && gameState.phase === 'play'
  const scheme = playerState.hand?.find(scheme => scheme.id === schemeId)
  return (
    <>
      <StatusView
        label={label}
        value={scheme?.rank}
      />
      <Curtain open={showAction}>
        <ChakraButton onClick={onReturn}>Return to hand</ChakraButton>
      </Curtain>
    </>
  )
}
