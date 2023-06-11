import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import CardStackView from './CardStack'
import Curtain from './Curtain'
import Status from './Status'
import GameHistoryView from './GameHistory'
import PlayProvider from '../context/play/Provider'
import CourtView from './Court'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()?.reverse()
  return (
    <PlayProvider>
      <Status label='Phase' value={gameState.phase} />
      <Status label='Player Count' value={gameState.profiles?.length} />
      <Status label='Ready Count' value={gameState.readyCount} />
      <Curtain open={showContent}>
        <CardStackView label='Timeline' cardGroup={timeline} />
        <CourtView />
        <CardStackView label='Dungeon' cardGroup={gameState.dungeon} />
      </Curtain>
      <ProfilesView />
      <GameHistoryView />
    </PlayProvider>
  )
}
