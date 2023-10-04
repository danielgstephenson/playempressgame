import { Fragment, useContext } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import getInDungeonStyles from '../service/getInDungeonStyles'
import ImprisonedButton from './ImprisonedButton'
import SmallSchemesContainerView from './SmallSchemesContainer'
import SortableSchemeView from './SortableScheme'
import TakePalaceView from './TakePalace'
import { Text } from '@chakra-ui/react'
import { playerContext } from '../reader/player'
import profileContext from '../context/profile'

export default function TakeDungeonView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playState = useContext(playContext)
  const playerState = useContext(playerContext)
  const profileState = useContext(profileContext)
  const twelve = playState.inPlay?.some((scheme) => scheme.rank === 12)
  if (twelve !== true) {
    return <></>
  }
  if (gameState.dungeon == null || playState.dungeon == null) {
    return <></>
  }
  const emptied = gameState.dungeon.length !== 0 && playState.dungeon.length === 0
  const sortableSchemes = playState.dungeon.map((scheme, index) => {
    if (
      profileState.reserveLength == null ||
      gameState.choices == null ||
      gameState.court == null ||
      gameState.phase == null ||
      playState.inPlay == null ||
      playerState.userId == null ||
      gameState.id == null
    ) return <Fragment key={scheme.id} />
    const inCourtStyles = getInDungeonStyles({
      choices: gameState.choices,
      court: gameState.court,
      reserve: playState.reserve,
      reserveLength: profileState.reserveLength,
      gameId: gameState.id,
      phase: gameState.phase,
      rank: scheme.rank,
      inPlay: playState.inPlay,
      userId: playerState.userId
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
