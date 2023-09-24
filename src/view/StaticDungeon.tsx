import { Stack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import profileContext from '../context/profile'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import getInDungeonStyles from '../service/getInDungeonStyles'
import useStaticSchemes from '../use/useStaticSchemes'
import ImprisonedButton from './ImprisonedButton'
import SchemesContainerView from './SchemesContainer'
import StaticPalaceHeadingView from './StaticPalaceHeading'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function StaticDungeonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const profileState = useContext(profileContext)
  const dungeon = useStaticSchemes({ property: 'dungeon' })
  if (dungeon == null) return <></>
  const views = dungeon.map(scheme => {
    if (
      gameState.choices == null ||
      gameState.court == null ||
      gameState.phase == null ||
      gameState.id == null
    ) {
      return <Fragment key={scheme.id} />
    }
    const styles = getInDungeonStyles({
      choices: gameState.choices,
      deck: playState.deck,
      deckEmpty: profileState.deckEmpty,
      court: gameState.court,
      gameId: gameState.id,
      phase: gameState.phase,
      rank: scheme.rank,
      tableau: playState.tableau,
      userId: playerState.userId
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
