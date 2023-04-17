import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'
import { ArrayUnionOrRemove, MetaType } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[]
  timestamp: number
}

export interface SchemeRef {
  id: string
  rank: number
}
export interface SchemeData {
  rank: number
  color: string
  title: string
  time: number
  beginning: string
  end: string
  threat?: string
  link1: string
  link2: string
  effect: SchemeEffect
}
export type Scheme = SchemeRef & SchemeData

export type Result <Collection extends MetaType> = Collection['read'] & { id: string }

export interface GameUser {
  id: string
  displayName: string
}

export interface Choice {
  playerId: string
  type: 'trash'
}

export type Game = MetaTypeCreator<{
  choices: Choice[]
  createdAt: ServerTimestamp
  court: SchemeRef[]
  dungeon: SchemeRef[]
  history: HistoryEvent[]
  name: string
  phase: string
  readyCount: number
  timeline: SchemeRef[]
  users: GameUser[]
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
  topDiscardScheme: SchemeRef | DeleteField
  gold: number | PossiblyReadAsUndefined
  trashEmpty: boolean | DeleteField
  playEmpty: boolean | DeleteField
  ready: boolean | DeleteField
}, 'profiles', string>

export type Player = MetaTypeCreator<{
  deck: SchemeRef[]
  discard: SchemeRef[]
  displayName: string
  gameId: string
  gold: number
  hand: SchemeRef[]
  history: HistoryEvent[]
  playId: string | DeleteField
  trashId: string | DeleteField
  userId: string
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
  scheme: SchemeRef
}

export interface CurrentUserGuard {
  currentUserRef: DocumentReference<User>
  currentUserData: User['read']
  currentUid: string
  currentUser: Result<User>
}

export interface PassTime {
  passedTimeline: SchemeRef[]
  timeEvent: HistoryEvent
}

export interface SchemeEffectProps {
  appointments: SchemeRef[]
  choices: Choice[]
  deck: SchemeRef[]
  discard: SchemeRef[]
  dungeon: SchemeRef[]
  gold: number
  passedTimeline: SchemeRef[]
  hand: SchemeRef[]
  playerId: string
  playSchemes: SchemeRef[]
}

export interface SchemeResult {
  appointments: SchemeRef[]
  choices: Choice[]
  deck: SchemeRef[]
  discard: SchemeRef[]
  gold: number
  hand: SchemeRef[]
  playerEvents: HistoryEvent[]
}

export type SchemeEffect = (props: SchemeEffectProps) => SchemeResult

export interface DrawRefs {
  drawnHand: SchemeRef[]
  drawnDeck: SchemeRef[]
  drawnDiscard: SchemeRef[]
  deckDrawn: SchemeRef[]
  discardDrawn: SchemeRef[]
  flipped: boolean
  privelegeTaken: SchemeRef[]
}
export interface DrawResult extends DrawRefs {
  drawEvents: HistoryEvent[]
}

export interface ReviveRefs {
  revivedDiscard: SchemeRef[]
  revivedHand: SchemeRef[]
  revivedList: SchemeRef[]
}

export interface ReviveResult extends ReviveRefs {
  reviveEvents: HistoryEvent[]
}

export interface Grammar {
  count: string
  verb: string
  noun: string
  phrase: string
  object: string
}
