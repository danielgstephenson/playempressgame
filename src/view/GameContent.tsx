import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import CardStackView from './CardStack'
import Curtain from './Curtain'
import Status from './Status'
import GameHistoryView from './GameHistory'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  return (
    <>
      <Status label='Phase' value={gameState.phase} />
      <Status label='Player Count' value={gameState.profiles?.length} />
      <Status label='Ready Count' value={gameState.readyCount} />
      <Curtain open={showContent}>
        <CardStackView label='Timeline' cardGroup={gameState.timeline} />
        <CardStackView label='Court' cardGroup={gameState.court} />
        <CardStackView label='Dungeon' cardGroup={gameState.dungeon} />
      </Curtain>
      <ProfilesView />
      <GameHistoryView />
    </>
  )
}
