import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'
import { ArrayUnionOrRemove } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[] | undefined
  timestamp: number
}

export interface Scheme {
  id: string
  rank: number
}

export type Game = MetaTypeCreator<{
  name: string
  createdAt: ServerTimestamp
  phase: string
  userIds: string[]
  court: Scheme[]
  dungeon: Scheme[]
  timeline: Scheme[]
  history: HistoryEvent[]
  readyCount: number
}, 'games', string>

export type User = MetaTypeCreator<{
  displayName: string
  uid: string
}, 'users', string>

export type Profile = MetaTypeCreator<{
  userId: string
  gameId: string
  deckEmpty: boolean | PossiblyReadAsUndefined
  displayName: string
  topDiscardScheme: Scheme | DeleteField
  gold: number | PossiblyReadAsUndefined
  trashEmpty: boolean | DeleteField
  playEmpty: boolean | DeleteField
  ready: boolean | DeleteField
}, 'profiles', string>

export type Player = MetaTypeCreator<{
  userId: string
  gameId: string
  hand: Scheme[]
  deck: Scheme[]
  discard: Scheme[]
  history: HistoryEvent[]
  displayName: string
  trashId: string | DeleteField
  playId: string | DeleteField
}, 'players', string>

export interface JoinedGameGuard {
  gameData: Game['read']
  gameRef: DocumentReference<Game>
  currentUid: string
  userRef: DocumentReference<User>
}

export interface PlayerGuard {
  currentUid: string
  gameData: Game['read']
  gameRef: DocumentReference<Game>
  playerData: Player['read']
  playerId: string
  playerRef: DocumentReference<Player>
  profileRef: DocumentReference<Profile>
}

export interface AddGameProps {
  displayName: string
}

export interface JoinGameProps {
  gameId: string
}

export interface StartGameProps {
  gameId: string
}

export interface TrashSchemeProps {
  gameId: string
  schemeId: string
}

export interface PlaySchemeProps {
  gameId: string
  schemeId: string
}

export interface UnplaySchemeProps {
  gameId: string
  schemeId: string
}

export interface UntrashSchemeProps {
  gameId: string
  schemeId: string
}

export interface PlayReadyProps {
  gameId: string
}

export interface PlayUnreadyProps {
  gameId: string
}

export interface HistoryUpdate {
  history: ArrayUnionOrRemove<HistoryEvent>
}
