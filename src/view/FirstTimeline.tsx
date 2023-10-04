import { useContext } from 'react'
import playContext from '../context/play'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import getInTimelineStyles from '../service/getInTimelineStyles'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function FirstTimelineView (): JSX.Element {
  const gameState = useContext(gameContext)
  const profileState = useContext(profileContext)
  const playState = useContext(playContext)
  if (
    gameState.timeline == null ||
    gameState.choices == null ||
    gameState.dungeon == null ||
    gameState.phase == null ||
    gameState.profiles == null
  ) return <></>
  const [first] = gameState.timeline
  if (first == null) return <></>
  const styles = getInTimelineStyles({
    choices: gameState.choices,
    reserve: playState.reserve,
    dungeon: gameState.dungeon,
    phase: gameState.phase,
    profiles: gameState.profiles,
    rank: first.rank,
    inPlay: playState.inPlay,
    userId: profileState.userId
  })
  return (
    <TinyExpandableSchemeView
      rank={first.rank}
      mr='4px'
      {...styles}
    />
  )
}
