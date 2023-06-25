import { Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import StaticSchemesView from './StaticSchemes'

export default function PrivateTableauView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  if (gameState.phase === 'play') {
    return <></>
  }
  return (
    <>
      <Heading size='sm'>Tableau:</Heading>
      <StaticSchemesView
        schemes={playerState.tableau}
      />
    </>
  )
}
