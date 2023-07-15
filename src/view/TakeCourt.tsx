import { RepeatClockIcon } from '@chakra-ui/icons'
import { Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'
import TakePalaceView from './TakePalace'

export default function TakeCourtView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  if (gameState.court == null || playState.court == null) {
    return <></>
  }
  const emptied = gameState.court.length !== 0 && playState.court.length === 0
  const sortableSchemes = playState.court.map((scheme, index) => {
    const inCourtStyles = getInCourtStyles({
      deck: playState.deck,
      dungeon: gameState.dungeon,
      phase: gameState.phase,
      rank: scheme.rank,
      tableau: playState.tableau
    })
    return (
      <SortableSchemeView
        key={scheme.id}
        id={scheme.id}
        rank={scheme.rank}
        {...inCourtStyles}
      />
    )
  })
  const timePassedIcon = gameState.timePassed === true && <RepeatClockIcon />
  return (
    <TakePalaceView id='court' label={<><Text>Court</Text> {timePassedIcon}</>} schemes={playState.court} over={playState.overCourt} emptied={emptied}>
      <SmallSchemesContainerView length={playState.court.length} overflow='auto'>{sortableSchemes}</SmallSchemesContainerView>
    </TakePalaceView>
  )
}
