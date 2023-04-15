import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'
import { ArrayUnionOrRemove, MetaType } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[] | undefined
  timestamp: number
}

export interface Scheme {
  id: string
  rank: number
}

export type Result <Collection extends MetaType> = Collection['read'] & { id: string }

export interface GameUser {
  id: string
  displayName: string
}

export type Game = MetaTypeCreator<{
  name: string
  createdAt: ServerTimestamp
  phase: string
  users: GameUser[]
  history: HistoryEvent[]
  court: Scheme[]
  dungeon: Scheme[]
  timeline: Scheme[]
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

export interface CurrentGameGuard {
  currentGameData: Game['read']
  currentGameRef: DocumentReference<Game>
  currentUid: string
  currentUserRef: DocumentReference<User>
}

export interface CurrentPlayerGuard {
  currentUid: string
  currentGameData: Game['read']
  currentGameRef: DocumentReference<Game>
  currentPlayer: Result<Player>
  currentPlayerData: Player['read']
  currentPlayerId: string
  currentPlayerRef: DocumentReference<Player>
  currentProfileRef: DocumentReference<Profile>
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

export interface CurrentHandGuard extends CurrentPlayerGuard {
  scheme: Scheme
}

export interface CurrentUserGuard {
  currentUserRef: DocumentReference<User>
  currentUserData: User['read']
  currentUid: string
  currentUser: Result<User>
}

export interface PassTime {
  passedTimeline: Scheme[]
  timeEvent: HistoryEvent
}
