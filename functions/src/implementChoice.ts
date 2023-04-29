import { https } from 'firebase-functions/v1'
import { arrayUnion, deleteField, Transaction, DocumentReference } from 'firelord'
import createEvent from './create/event'
import getJoined from './get/joined'
import getOtherPlayers from './get/otherPlayers'
import guardChoiceChanges from './guard/choiceChanges'
import guardHighs from './guard/highs'
import { Write, Game, Player, Result, Choice, HistoryEvent, Profile } from './types'
import choiceUpdatePlayer from './update/ChoicePlayer'
import updateOtherPlayers from './update/otherPlayers'

export default async function implementChoice ({
  chosenPlayer,
  gameId,
  currentGame,
  transaction,
  currentPlayer,
  choice,
  chosenPlayerEvents,
  currentPlayerRef,
  currentProfileRef,
  chosenProfileChanges,
  currentUid,
  publicEvents,
  currentGameRef
}: {
  chosenPlayer: Result<Player>
  gameId: string
  currentGame: Result<Game>
  transaction: Transaction
  currentPlayer: Result<Player>
  choice: Choice
  chosenPlayerEvents: HistoryEvent[]
  currentPlayerRef: DocumentReference<Player>
  currentProfileRef: DocumentReference<Profile>
  chosenProfileChanges: Write<Profile>
  currentUid: string
  publicEvents: HistoryEvent[]
  currentGameRef: DocumentReference<Game>
}): Promise<void> {
  const otherPlayers = await getOtherPlayers({
    currentUid: chosenPlayer.userId,
    gameId,
    transaction
  })
  const chosenPlayers = [chosenPlayer, ...otherPlayers]
  const chosenGameChanges: Write<Game> = {}
  const chosenGameChoices = currentGame.choices.filter(gameChoice => gameChoice.id !== choice.id)
  const chosenGame = {
    ...currentGame,
    choices: chosenGameChoices
  }
  const {
    effectChoices,
    effectSummons,
    effectPlayerEvents,
    playerChanges,
    profileChanges,
    profileChanged
  } = guardChoiceChanges({
    allPlayers: chosenPlayers,
    choice,
    currentPlayer: chosenPlayer,
    currentGame: chosenGame,
    oldPlayer: currentPlayer
  })
  const waitingForOthers = chosenGame.choices.length > 0
  if (waitingForOthers) {
    if (effectSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...effectSummons)
    }
    if (effectChoices.length > 0) {
      chosenGameChoices.push(...effectChoices)
    }
    chosenPlayerEvents.push(...effectPlayerEvents)
    transaction.update(currentPlayerRef, {
      ...playerChanges,
      history: arrayUnion(...chosenPlayerEvents)
    })
    transaction.update(currentProfileRef, {
      ...chosenProfileChanges,
      ...profileChanges
    })
    chosenGameChanges.choices = chosenGameChoices
    chosenGameChanges.history = arrayUnion(...publicEvents)
    transaction.update(currentGameRef, chosenGameChanges)
    updateOtherPlayers({
      currentUid,
      gameId,
      transaction,
      users: chosenGame.users,
      update: {
        history: arrayUnion(...publicEvents)
      }
    })
    return
  }
  chosenGameChoices.push(...effectChoices)
  const chosenGameSummons = [...effectSummons]
  chosenPlayerEvents.push(...effectPlayerEvents)
  if (effectChoices.length > 0) {
    if (chosenGameSummons.length > 0) {
      chosenGameChanges.court = arrayUnion(...chosenGameSummons)
    }
    chosenGameChanges.choices = chosenGameChoices
    transaction.update(currentGameRef, chosenGameChanges)
    transaction.update(currentPlayerRef, {
      ...playerChanges,
      history: arrayUnion(...chosenPlayerEvents)
    })
    transaction.update(currentProfileRef, {
      ...chosenProfileChanges,
      ...profileChanges
    })
    return
  }
  const { high, highEvent, highRank, highRef, highRefs, highs } = guardHighs(chosenPlayers)
  chosenPlayerEvents.push(highEvent)
  publicEvents.push(highEvent)
  if (highs.length > 1) {
    chosenGameChanges.dungeon = arrayUnion(...highRefs)
    const imprisonedPlayers = chosenPlayers.filter(player => {
      return player.playScheme?.rank === high?.rank
    })
    const displayNames = imprisonedPlayers.map(player => player.displayName)
    const joined = getJoined(displayNames)
    const publicEvent = createEvent(`The ${highRank} played by ${joined} are imprisoned in the dungeon.`)
    publicEvents.push(publicEvent)
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
        current,
        publicEvents,
        privateEvents: chosenPlayerEvents,
        sharedEvents: imprisonEvents,
        player,
        playerChanges,
        profileChanges,
        profileChanged,
        transaction
      })
    })
  } else {
    chosenGameChanges.court = arrayUnion(highRef)
    const summonee = chosenPlayers.find(player => player.playScheme?.id === high?.id)
    const displayName = String(summonee?.displayName)
    const publicEvent = createEvent(`The ${highRank} played by ${displayName} is summoned to the court.`)
    publicEvents.push(publicEvent)
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
        current,
        player,
        playerChanges,
        privateEvents: chosenPlayerEvents,
        profileChanges,
        profileChanged,
        publicEvents,
        sharedEvents: summonEvents,
        transaction
      })
    })
  }
  transaction.update(currentGameRef, {
    ...chosenGameChanges,
    choices: chosenGameChoices,
    history: arrayUnion(...publicEvents)
  })
}
