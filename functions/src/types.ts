import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'
import { ArrayUnionOrRemove, MetaType } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[] | undefined
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
  userId: string
  gameId: string
  hand: SchemeRef[]
  deck: SchemeRef[]
  discard: SchemeRef[]
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
  allPlayers: Array<Player['read']>
  playerResult: Result<Player>
  gameData: Game['read']
  hand: SchemeRef[]
  passedTimeline: SchemeRef[]
}

type PartialPlayerWrite = Partial<Player['write']>

type SchemePlayerResult = Omit<PartialPlayerWrite, 'hand' | 'history'>

export interface SchemeResult {
  appointments?: SchemeRef[]
  choices?: Choice[]
  hand: SchemeRef[]
  playerChanges?: SchemePlayerResult
  profileChanges?: Partial<Profile['write']>
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
