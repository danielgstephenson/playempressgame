import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import Status from './Status'
import GameHistoryView from './GameHistory'
import PlayProvider from '../context/play/Provider'
import PalaceView from './Palace'
import StaticAreaView from './StaticArea'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()
  return (
    <PlayProvider>
      <Status label='Phase' value={gameState.phase} />
      <Status label='Player Count' value={gameState.profiles?.length} />
      <Status label='Ready Count' value={gameState.readyCount} />
      <Curtain open={showContent}>
        <StaticAreaView label='Timeline' schemes={timeline} />
        <PalaceView />
      </Curtain>
      <ProfilesView />
      <GameHistoryView />
    </PlayProvider>
  )
}
