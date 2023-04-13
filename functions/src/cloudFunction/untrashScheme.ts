import { createCloudFunction } from "../create/cloudFunction"
import guardPlayerData from "../guard/playerData"
import { createEvent } from "../create/event"
import { gamesLord } from "../db"
import { UntrashSchemeProps } from "../types"
import { arrayUnion, deleteField } from "firelord"
import guardDefined from "../guard/defined"

const untrashScheme = createCloudFunction<UntrashSchemeProps>(async (props, context, transaction) => {
  const { playerRef, profileRef, playerData } = await guardPlayerData({
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
  const gameRef = gamesLord.doc(props.gameId)
  transaction.update(gameRef, {
    history: arrayUnion(
      createEvent(`${playerData.displayName} returned the scheme from their trash.`)
    )
  })
  console.log('untrashed scheme!')
})
export default untrashScheme