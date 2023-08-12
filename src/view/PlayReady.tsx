import Cloud from './Cloud'
import { gameContext } from '../reader/game'
import { useContext } from 'react'
import Curtain from './Curtain'
import { playerContext } from '../reader/player'
import playContext from '../context/play'
import getScore from '../service/getScore'
import getWinners from '../service/getWinners'
import { CloseIcon, MinusIcon, StarIcon } from '@chakra-ui/icons'
import ScorePopoverView from './ScorePopover'
import { HStack, Text } from '@chakra-ui/react'
import FinalIconPopoverButtonView from './FinalIconPopoverButton'
import isGameOver from '../service/isGameOver'

export default function PlayReadyView (): JSX.Element {
  const gameState = useContext(gameContext)
  const playerState = useContext(playerContext)
  const playState = useContext(playContext)
  if (gameState.profiles == null || gameState.final == null || gameState.choices == null) return <></>
  const gameOver = isGameOver({ profiles: gameState.profiles, final: gameState.final, choices: gameState.choices })
  if (gameOver) {
    const score = getScore(playerState)
    const winners = getWinners({ profiles: gameState.profiles })
    const winner = winners.some(winner => winner.userId === playerState.userId)
    if (winner) {
      if (winners.length > 1) {
        return (
          <ScorePopoverView score={score} icon={<MinusIcon />}>
            You tie at {score}.
          </ScorePopoverView>
        )
      }
      return (
        <ScorePopoverView score={score} icon={<StarIcon />}>
          You win with {score}.
        </ScorePopoverView>
      )
    }
    return (
      <ScorePopoverView score={score} icon={<CloseIcon />}>
        You lose with {score}.
      </ScorePopoverView>
    )
  }
  const showReady = gameState.phase === 'play' &&
    playState.trashSchemeId != null &&
    playState.playSchemeId != null &&
    playerState.playReady !== true &&
    playState.overPlay !== true &&
    playState.overTrash !== true
  const props = {
    gameId: gameState.id,
    trashSchemeId: playState.trashSchemeId,
    playSchemeId: playState.playSchemeId
  }
  const icon = gameState.final && <StarIcon />
  return (
    <Curtain open={showReady} hider={<FinalIconPopoverButtonView />}>
      <Cloud
        fn='playReady'
        props={props}
      >
        <HStack>
          <Text>Ready</Text> {icon}
        </HStack>
      </Cloud>
    </Curtain>
  )
}
