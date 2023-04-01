import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Action from './Action'
import Curtain from './Curtain'
import StatusView from './Status'

export default function PlayAreaView ({ fn, index, label }: {
  fn: string
  index?: number
  label: string
}): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const value = index != null && playerState.hand?.[index]
  const showAction = index != null
  return (
    <>
      <StatusView
        label={label}
        value={value}
      />
      <Curtain open={showAction}>
        <Action
          fn={fn}
          label='Return to hand'
          props={{ gameId: gameState.id }}
        />
      </Curtain>
    </>
  )
}
