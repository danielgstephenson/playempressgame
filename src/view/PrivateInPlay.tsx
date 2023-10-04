import { HStack, Text, VStack } from '@chakra-ui/react'
import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import getInPlayStyles from '../service/getInPlayStyles'
import ActiveHeading from './ActiveHeading'
import FinalIconPopoverButtonView from './FinalIconPopoverButton'
import PlayAreaView from './PlayArea'
import SchemesContainerView from './SchemesContainer'
import TinyExpandableSchemeView from './TinyExpandableScheme'

export default function PrivateInPlayView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const views = playerState.inPlay?.map(scheme => {
    if (
      playerState.bid == null ||
      gameState.choices == null ||
      gameState.court == null ||
      gameState.dungeon == null ||
      playState.reserve == null ||
      gameState.id == null ||
      gameState.phase == null ||
      gameState.profiles == null ||
      playerState.userId == null
    ) {
      return <Fragment key={scheme.id} />
    }
    const styles = getInPlayStyles({
      bid: playerState.bid,
      choices: gameState.choices,
      court: gameState.court,
      reserve: playState.reserve,
      dungeon: gameState.dungeon,
      gameId: gameState.id,
      phase: gameState.phase,
      profiles: gameState.profiles,
      rank: scheme.rank,
      schemeId: scheme.id,
      userId: playerState.userId
    })
    return (
      <TinyExpandableSchemeView {...styles} rank={scheme.rank} key={scheme.id} />
    )
  })
  return (
    <VStack spacing='2px' alignItems='start'>
      <ActiveHeading active={playState.overPlay}><HStack><Text>Play</Text><FinalIconPopoverButtonView /></HStack></ActiveHeading>
      <HStack spacing='2px' width='max-content'>
        <PlayAreaView />
        <SchemesContainerView>{views}</SchemesContainerView>
      </HStack>
    </VStack>
  )
}