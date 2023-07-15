import { RepeatClockIcon } from '@chakra-ui/icons'
import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import SchemesContainerView from './SchemesContainer'
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
  const timePassedIcon = gameState.timePassed === true && <RepeatClockIcon />
  return (
    <Box>
      <Heading size='sm'><HStack alignItems='start'><Text>Court</Text> {timePassedIcon}</HStack></Heading>
      <SchemesContainerView>{views}</SchemesContainerView>
    </Box>
  )
}
