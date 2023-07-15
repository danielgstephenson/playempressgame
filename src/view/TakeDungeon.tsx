import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInDungeonStyles from '../service/getInDungeonStyles'
import ImprisonedButton from './ImprisonedButton'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'
import TakePalaceView from './TakePalace'
import { Text } from '@chakra-ui/react'

export default function TakeDungeonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const twelve = playState.tableau?.some((scheme) => scheme.rank === 12)
  if (twelve !== true) {
    return <></>
  }
  if (gameState.dungeon == null || playState.dungeon == null) {
    return <></>
  }
  const emptied = gameState.dungeon.length !== 0 && playState.dungeon.length === 0
  const sortableSchemes = playState.dungeon.map((scheme, index) => {
    const inCourtStyles = getInDungeonStyles({
      court: gameState.court,
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
  return (
    <TakePalaceView id='dungeon' label={<><Text>Dungeon</Text> <ImprisonedButton /></>} schemes={playState.dungeon} emptied={emptied} over={playState.overDungeon}>
      <SmallSchemesContainerView length={playState.dungeon.length}>{sortableSchemes}</SmallSchemesContainerView>
    </TakePalaceView>
  )
}
