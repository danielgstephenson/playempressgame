import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Action from './Action'
import Curtain from './Curtain'
import StatusView from './Status'

export default function PlayAreaView ({ fn, id, label }: {
  fn: string
  id?: string
  label: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const scheme = id == null ? id : playerState.hand?.find(scheme => scheme.id === id)
  const showAction = id != null
  return (
    <>
      <StatusView
        label={label}
        value={scheme?.rank}
      />
      <Curtain open={showAction}>
        <Action
          fn={fn}
          label='Return to hand'
          props={{ gameId: gameState.id, schemeId: id }}
        />
      </Curtain>
    </>
  )
}
