import { useContext } from 'react'
import ProfilesView from './Profiles'
import { gameContext } from '../reader/game'
import Curtain from './Curtain'
import PlayProvider from '../context/play/Provider'
import PalaceView from './Palace'
import StaticCircleAreaView from './StaticCircleArea'

export default function GameContentView (): JSX.Element {
  const gameState = useContext(gameContext)
  const showContent = gameState.phase !== 'join'
  const timeline = gameState.timeline?.slice()
  return (
    <PlayProvider>
      <Curtain open={showContent}>
        <StaticCircleAreaView label='Timeline' schemes={timeline} />
        <PalaceView />
      </Curtain>
      <ProfilesView />
    </PlayProvider>
  )
}
