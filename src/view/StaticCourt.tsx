import { Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import SchemesContainerView from './SchemesContainer'
import StaticPalaceHeadingView from './StaticPalaceHeading'
import TimePassedButton from './TimePassedButton'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function StaticCourtView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const views = playState.court?.map(scheme => {
    const styles = getInCourtStyles({
      dungeon: gameState.dungeon,
      phase: gameState.phase,
      rank: scheme.rank,
      tableau: playState.tableau,
      deck: playState.deck
    })
    return <TinyExpandableSchemeView {...styles} rank={scheme.rank} key={scheme.id} />
  })
  return (
    <Stack spacing='3px' alignSelf='start'>
      <StaticPalaceHeadingView label='Court'>
        <TimePassedButton />
      </StaticPalaceHeadingView>
      <SchemesContainerView>{views}</SchemesContainerView>
    </Stack>
  )
}
