import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import SchemesContainerView from './SchemesContainer'
import TimePassedButton from './TimePassedButton c'
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
    <Box alignSelf='start'>
      <Heading size='sm'><HStack><Text>Court</Text> <TimePassedButton /></HStack></Heading>
      <SchemesContainerView>{views}</SchemesContainerView>
    </Box>
  )
}
