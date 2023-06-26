import DeckView from './Deck'
import DiscardView from './Discard'
import HandView from './Hand'
import TrashAreaView from './TrashArea'
import PlayAreaView from './PlayArea'
import PlayReadyView from './PlayReady'
import PlayerHistoryView from './PlayerHistory'
import ChoiceView from './Choice'
import PrivateTrashView from './PrivateTrash'
import BidView from './Bid'
import { useContext, useEffect } from 'react'
import playContext from '../context/play'
import { gameContext } from '../reader/game'
import { playerContext } from '../reader/player'
import Status from './Status'
import { HStack, VStack } from '@chakra-ui/react'
import PrivateTableauView from './PrivateTableau'

export default function PlayerView (): JSX.Element {
  const { round, phase } = useContext(gameContext)
  const { resetTaken, setDeck, setHand, setHandClone, setPlaySchemeId, setTrashSchemeId, trash, play } = useContext(playContext)
  const { deck, gold, hand, silver } = useContext(playerContext)
  useEffect(() => {
    trash?.(undefined)
    play?.(undefined)
    resetTaken?.()
  }, [resetTaken, round, trash, play])
  useEffect(() => {
    if (deck == null) {
      return
    }
    setDeck?.(deck)
  }, [deck, setDeck])
  useEffect(() => {
    if (hand == null) {
      return
    }

    setHand?.(current => {
      const already = current?.filter(scheme => hand.some(handScheme => handScheme.id === scheme.id))

      const newSchemes = hand.filter(scheme => !current.some(currentScheme => currentScheme.id === scheme.id))
      const newHand = [...newSchemes, ...already]
      setHandClone?.(newHand)
      return newHand
    })
  }, [hand, setHand, setHandClone])
  useEffect(() => {
    if (phase !== 'play') {
      setPlaySchemeId?.(undefined)
      setTrashSchemeId?.(undefined)
    }
  }, [setPlaySchemeId, setTrashSchemeId, phase])

  return (
    <>
      <HStack alignItems='start'>
        <PlayAreaView />
        <VStack direction='column' flexGrow='1'>
          <Status label='Gold' value={gold} />
          <Status label='Silver' value={silver} />
          <PlayReadyView />
        </VStack>
        <TrashAreaView />
      </HStack>
      <PrivateTableauView />
      <BidView />
      <ChoiceView />
      <HandView />
      <DeckView />
      <DiscardView />
      <PrivateTrashView />
      <PlayerHistoryView />
    </>
  )
}
