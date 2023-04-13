import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { playersLord } from "../db"
import { UntrashSchemeProps } from "../types"
import { arrayUnion, deleteField } from "firelord"
import guardDefined from "../guard/defined"

const untrashScheme = createCloudFunction<UntrashSchemeProps>(async (props, context, transaction) => {
  const { currentUid, gameData, gameRef, playerRef, profileRef, playerData } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log(`untrashing scheme...`)
  const scheme = playerData.hand.find( (scheme: any) => scheme.id === props.schemeId)
  const untrashScheme = guardDefined(scheme, 'Untrash Scheme')
  transaction.update(playerRef, {
    trashId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${untrashScheme.rank} from your trash`)
    )
  })
  transaction.update(profileRef, {
    trashEmpty: true,
    ready: false
  })
  const untrashEvent = createEvent(`${playerData.displayName} returned the scheme from their trash.`)
  transaction.update(gameRef, {
    history: arrayUnion(
      untrashEvent
    )
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersLord.doc(playerId)
    transaction.update(playerRef, {
      history: arrayUnion(untrashEvent)
    })
  })
  console.log('untrashed scheme!')
})
export default untrashScheme