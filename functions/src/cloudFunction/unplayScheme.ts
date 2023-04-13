import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { playersLord } from "../db"
import { UnplaySchemeProps } from "../types"
import guardHandScheme from "../guard/handScheme"
import { arrayUnion, deleteField } from "firelord"

const unplayScheme = createCloudFunction<UnplaySchemeProps>(async (props, context, transaction) => {
  console.log('props.gameId', props.gameId)
  const { currentUid, gameData, gameRef, playerRef, profileRef, playerData } = await guardPlayerData({
    gameId: props.gameId,
    transaction,
    context
  })
  console.log('playerRef', playerRef)
  console.log(`unplaying scheme...`)
  const unplayScheme = guardHandScheme({ hand: playerData.hand, schemeId: props.schemeId })
  transaction.update(playerRef, {
    playId: deleteField(),
    history: arrayUnion(
      createEvent(`You returned scheme ${unplayScheme.rank} from play`)
    )
  })
  transaction.update(profileRef, {
    playEmpty: true,
    ready: false
  })
  const unplayEvent = createEvent(`${playerData.displayName} returned their scheme from play.`)
  transaction.update(gameRef, {
    history: arrayUnion(unplayEvent)
  })
  gameData.userIds.forEach( (userId : any) => {
    if(userId === currentUid) return
    const playerId = `${userId}_${props.gameId}`
    const playerRef = playersLord.doc(playerId)
    transaction.update(playerRef, {
      history: arrayUnion(unplayEvent)
    })
  })
  console.log('unplayed scheme!')
})
export default unplayScheme