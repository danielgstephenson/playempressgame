import { Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInDungeonStyles from '../service/getInDungeonStyles'
import ImprisonedButton from './ImprisonedButton'
import SchemesContainerView from './SchemesContainer'
import StaticPalaceHeadingView from './StaticPalaceHeading'
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
    <Stack alignSelf='start' spacing='3px'>
      <StaticPalaceHeadingView label='Dungeon'>
        <ImprisonedButton />
      </StaticPalaceHeadingView>
      <SchemesContainerView>{views}</SchemesContainerView>
    </Stack>
  )
}
