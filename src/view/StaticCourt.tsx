import { Stack } from '@chakra-ui/react'
import { useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInCourtStyles from '../service/getInCourtStyles'
import useStaticSchemes from '../use/useStaticSchemes'
import SchemesContainerView from './SchemesContainer'
import StaticPalaceHeadingView from './StaticPalaceHeading'
import TimePassedButton from './TimePassedButton'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function StaticCourtView (): JSX.Element {
  const gameState = useContext(gameContext)
  console.log('gameState', gameState)
  const playState = useContext(playContext)
  const court = useStaticSchemes({ property: 'court' })
  if (court == null) return <></>
  const views = court.map(scheme => {
    const styles = getInCourtStyles({
      dungeon: gameState.dungeon,
      phase: gameState.phase,
      rank: scheme.rank,
      inPlay: playState.inPlay,
      reserve: playState.reserve
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
