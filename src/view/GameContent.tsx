import { useContext } from 'react'
import ProfilesView from './Profiles'
import { Text } from '@chakra-ui/react'
import { gameContext } from '../reader/game'
import CardStackView from './CardStack'
import Curtain from './Curtain'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  return (
    <>
      <Text>Phase: {gameState.phase}</Text>
      <Curtain open={showContent}>
        <CardStackView label='Timeline' cardGroup={gameState.timeline} />
        <CardStackView label='Court' cardGroup={gameState.court} />
        <CardStackView label='Dungeon' cardGroup={gameState.dungeon} />
      </Curtain>
      <ProfilesView />
    </>
  )
}
