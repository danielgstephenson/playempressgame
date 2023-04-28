import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Game, Player, SchemeProps, Write } from '../types'
import { arrayRemove, arrayUnion, deleteField } from 'firelord'
import updateOtherPlayers from '../update/otherPlayers'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import getJoined from '../get/joined'
import { https } from 'firebase-functions/v1'
import { playersRef } from '../db'
import serializeScheme from '../serialize/scheme'
import guardDefined from '../guard/defined'
import guardChoiceChanges from '../guard/choiceChanges'
import isChanged from '../is/changed'
import guardHighs from '../guard/highs'
import guardChoiceResult from '../guard/choiceResult'
import { effect } from '@chakra-ui/react'

const deckChoose = createCloudFunction<SchemeProps>(async (props, context, transaction) => {
  console.info(`Choosing scheme ${props.schemeId} to put on deck...`)
  const {
    choice,
    currentUid,
    currentGame,
    currentGameRef,
    currentPlayer,
    currentPlayerRef,
    currentProfileRef,
    schemeRef
  } = await guardChoice({
    gameId: props.gameId,
    transaction,
    context,
    schemeId: props.schemeId,
    label: 'Deck choice scheme'
  })
  const privateChoiceEvent = createEvent(`You put scheme ${schemeRef.rank} face down on your deck.`)
  const publicChoiceEvent = createEvent(`${currentPlayer.displayName} put a scheme face down on their deck.`)
  const lastEvent = currentPlayer.history[currentPlayer.history.length - 1]
  const last = guardDefined(lastEvent, 'Last event')
  const updatedLast = { ...last, children: [...last.children] }
  updatedLast.children.push(privateChoiceEvent)
  const chosenPlayer = {
    ...currentPlayer,
    hand: currentPlayer.hand.filter(scheme => {
      return scheme.id !== props.schemeId
    }),
    deck: [...currentPlayer.deck, schemeRef]
  }
  const otherPlayers = await getOtherPlayers({
    currentUid: currentPlayer.userId,
    gameId: props.gameId,
    transaction
  })
  const chosenPlayers = [chosenPlayer, ...otherPlayers]
  const chosenPlayerHistory = currentPlayer.history.slice(0, -1)
  chosenPlayerHistory.push(updatedLast)
  const chosenGameHistory = currentGame.history.slice(0, -1)
  chosenGameHistory.push(publicChoiceEvent)
  const chosenGameChoices = currentGame.choices.filter(gameChoice => gameChoice.id !== choice.id),
  const chosenGameChanges: Write<Game> = {
    history: chosenGameHistory
  }
  const waiting = currentGame.choices.length > 1
  if (waiting) {
    const playChanges = guardChoiceChanges({
      allPlayers: chosenPlayers,
      choice,
      currentPlayer: chosenPlayer,
      currentGame,
      currentPlayerRef
    })
    if (playChanges.effectSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...playChanges.effectSummons)
    }
    if (playChanges.effectChoices.length > 0) {
      chosenGameChoices.push(...playChanges.effectChoices)
    }
    chosenPlayerHistory.push(...playChanges.effectPlayerEvents)
    transaction.update(currentPlayerRef, {
      ...playChanges?.playerChanges,
      history: chosenPlayerHistory
    })
    transaction.update(currentProfileRef, {
      deckEmpty: chosenPlayer.deck.length === 0,
      ...playChanges?.profileChanges
    })
    chosenGameChanges.choices = chosenGameChoices
    transaction.update(currentGameRef, chosenGameChanges)
    updateOtherPlayers({
      currentUid,
      gameId: props.gameId,
      transaction,
      users: currentGame.users,
      update: {
        history: arrayUnion(publicChoiceEvent)
      }
    })
    return
  }
  const changes = guardChoiceChanges({
    allPlayers: chosenPlayers,
    choice,
    currentPlayer: chosenPlayer,
    currentGame,
    currentPlayerRef
  })
  const chosenGameSummons = [...changes.effectSummons]
  chosenPlayerHistory.push(...changes.effectPlayerEvents)
  if (changes.effectChoices.length > 0) {
    chosenGameChoices.push(...changes.effectChoices)
    if (chosenGameSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...chosenGameSummons)
    }
    transaction.update(currentGameRef, chosenGameChanges)
    transaction.update(currentPlayerRef, {
      ...changes.playerChanges,
      history: chosenPlayerHistory
    })
    if (changes.profileChanged) {
      transaction.update(currentProfileRef, changes.profileChanges)
    }
  }
  // chosenPlayer.deck = effectResult.effectDeck
  // chosenPlayer.discard = effectResult.effectDiscard
  // chosenPlayer.gold = effectResult.effectGold
  // chosenPlayer.hand = effectResult.effectHand
  // chosenPlayer.silver = effectResult.effectSilver
  const { high, highs, highEvent, highRank } = guardHighs(chosenPlayers)
  chosenPlayerHistory.push(highEvent)
  chosenGameHistory.push(highEvent)
  if (highs.length > 1) {
    const imprisonedPlayers = chosenPlayers.filter(player => {
      return player.playScheme?.rank === high?.rank
    })
    const displayNames = imprisonedPlayers.map(player => player.displayName)
    const joined = getJoined(displayNames)
    const publicEvent = createEvent(`The ${highRank} played by ${joined} are imprisoned in the dungeon.`)
    chosenGameHistory.push(publicEvent)
    chosenPlayers.forEach(player => {
      if (player.playScheme == null) {
        throw new https.HttpsError('failed-precondition', 'You have no play scheme.')
      }
      const current = player.id === currentPlayer.id
      const playerRef = playersRef.doc(player.id)
      const imprisonEvents = []
      const imprisoned = player.playScheme.rank === high?.rank
      const imprisonUpdate: Write<Player> = {}
      if (imprisoned) {
        const otherImprisoned = imprisonedPlayers.filter(imprisonedPlayer => {
          return imprisonedPlayer.id !== player.id
        })
        const otherDisplayNames = otherImprisoned.map(player => player.displayName)
        const privateDisplayNames = ['You', ...otherDisplayNames]
        const privateJoined = getJoined(privateDisplayNames)
        const rank = otherDisplayNames.length === 1 ? highRank : `${highRank}s`
        const privateEvent = createEvent(`${privateJoined} imprison your ${rank} in the dungeon.`)
        imprisonEvents.push(privateEvent)
        imprisonUpdate.playScheme = deleteField()
      } else {
        imprisonEvents.push(publicEvent)
      }
      if (current) {
        chosenPlayerHistory.push(...imprisonEvents)
        const playerChanges = {
          ...changes.playerChanges,
          ...imprisonUpdate,
          history: chosenPlayerHistory
        }
        transaction.update(currentPlayerRef, playerChanges)
        if (changes.profileChanged) {
          transaction.update(currentProfileRef, changes.profileChanges)
        }
        return
      }
      imprisonUpdate.history = arrayUnion(...imprisonEvents)
      transaction.update(playerRef, imprisonUpdate)
    })
    transaction.update(currentGameRef, {
      choices: arrayRemove(choice),
      history: arrayUnion(...gameEvents)
    })
  } else {
    const summonee = chosenPlayers.find(player => player.playScheme?.id === high?.id)
    const displayName = String(summonee?.displayName)
    const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
    gameEvents.push(publicEvent)
    chosenPlayers.forEach(player => {
      const current = player.id === currentPlayer.id
      const chosen = current ? chosenPlayer : player
      const events = current ? currentPlayerEvents : []
      events.push(highEvent)
      const summoned = player.playScheme?.id === high?.id
      if (summoned) {
        const privateEvent = createEvent(`Your ${highRank} is summoned to the court.`)
        events.push(privateEvent)
        chosen.hand = chosen.hand.filter(scheme => scheme.rank !== high?.rank)
      } else {
        events.push(publicEvent)
      }
      const playerRef = playersRef.doc(player.id)
      const playerChanges: Partial<Player['write']> = {}
      const handChanged = isChanged(player.hand, chosen.hand)
      if (handChanged) {
        playerChanges.hand = chosen.hand
      }
      const deckChanged = isChanged(player.deck, chosen.deck)
      if (deckChanged) {
        playerChanges.deck = arrayUnion(...chosen.deck)
      }
      if (events.length > 0) {
        playerChanges.history = arrayUnion(...events)
      }
      transaction.update(playerRef, playerChanges)
    })
    const highRef = serializeScheme(high)
    transaction.update(currentGameRef, {
      choices: arrayRemove(choice),
      court: arrayUnion(highRef),
      history: arrayUnion(...gameEvents)
    })
  }
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose


