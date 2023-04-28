import createCloudFunction from '../create/cloudFunction'
import createEvent from '../create/event'
import { Game, Player, SchemeProps, Write } from '../types'
import { arrayUnion, deleteField } from 'firelord'
import updateOtherPlayers from '../update/otherPlayers'
import guardChoice from '../guard/choice'
import getOtherPlayers from '../get/otherPlayers'
import getJoined from '../get/joined'
import { https } from 'firebase-functions/v1'
import guardDefined from '../guard/defined'
import guardChoiceChanges from '../guard/choiceChanges'
import guardHighs from '../guard/highs'
import choiceUpdatePlayer from '../update/ChoicePlayer'

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
  const chosenGameChoices = currentGame.choices.filter(gameChoice => gameChoice.id !== choice.id)
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
  const playChanges = guardChoiceChanges({
    allPlayers: chosenPlayers,
    choice,
    currentPlayer: chosenPlayer,
    currentGame,
    currentPlayerRef
  })
  const chosenGameSummons = [...playChanges.effectSummons]
  chosenPlayerHistory.push(...playChanges.effectPlayerEvents)
  if (playChanges.effectChoices.length > 0) {
    chosenGameChoices.push(...playChanges.effectChoices)
    if (chosenGameSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...chosenGameSummons)
    }
    transaction.update(currentGameRef, chosenGameChanges)
    transaction.update(currentPlayerRef, {
      ...playChanges.playerChanges,
      history: chosenPlayerHistory
    })
    if (playChanges.profileChanged) {
      transaction.update(currentProfileRef, playChanges.profileChanges)
    }
  }
  const { high, highEvent, highRank, highRef, highRefs, highs } = guardHighs(chosenPlayers)
  chosenPlayerHistory.push(highEvent)
  chosenGameHistory.push(highEvent)
  if (highs.length > 1) {
    chosenGameChanges.dungeon = arrayUnion(...highRefs)
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
      choiceUpdatePlayer({
        choiceChanges: imprisonUpdate,
        chosenPlayerHistory,
        current,
        events: imprisonEvents,
        playChanges,
        player,
        transaction
      })
    })
  } else {
    chosenGameChanges.court = arrayUnion(highRef)
    const summonee = chosenPlayers.find(player => player.playScheme?.id === high?.id)
    const displayName = String(summonee?.displayName)
    const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
    chosenGameHistory.push(publicEvent)
    chosenPlayers.forEach(player => {
      const current = player.id === currentPlayer.id
      const summonEvents = [highEvent]
      const summoned = player.playScheme?.id === high?.id
      const summonChanges: Write<Player> = {}
      if (summoned) {
        const privateEvent = createEvent(`Your ${highRank} is summoned to the court.`)
        summonEvents.push(privateEvent)
        summonChanges.playScheme = deleteField()
      } else {
        summonEvents.push(publicEvent)
      }
      choiceUpdatePlayer({
        choiceChanges: summonChanges,
        chosenPlayerHistory,
        current,
        events: summonEvents,
        playChanges,
        player,
        transaction
      })
    })
  }
  transaction.update(currentGameRef, chosenGameChanges)
  console.info(`Chose scheme with id ${props.schemeId} to put on deck!`)
})
export default deckChoose
