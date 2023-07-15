import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInDungeonStyles from '../service/getInDungeonStyles'
import ImprisonedButton from './ImprisonedButton'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function StaticDungeonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const views = playState.dungeon?.map(scheme => {
    const styles = getInDungeonStyles({
      court: gameState.court,
      phase: gameState.phase,
      rank: scheme.rank,
      tableau: playState.tableau
    })
    return <TinyExpandableSchemeView {...styles} rank={scheme.rank} key={scheme.id} />
  })
  return (
    <Box>
      <Heading size='sm'><HStack><Text>Dungeon</Text> <ImprisonedButton /></HStack></Heading>
      <SchemesContainerView>{views}</SchemesContainerView>
    </Box>
  )
}
