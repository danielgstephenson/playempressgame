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
export type SchemeColor = 'green' | 'yellow' | 'red'
export interface SchemeData {
  rank: number
  color: SchemeColor
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

export type ChoiceType = 'trash' | 'deck'

export interface Choice {
  playerId: string
  type: ChoiceType
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
  gold: number
  silver: number
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
  silver: number
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

export interface GameProps {
  gameId: string
}

export interface SchemeProps extends GameProps {
  schemeId: string
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

export interface SchemeEffectProps {
  appointments: Scheme[]
  choices: Choice[]
  deck: Scheme[]
  discard: Scheme[]
  dungeon: Scheme[]
  gold: number
  silver: number
  passedTimeline: Scheme[]
  hand: Scheme[]
  playerId: string
  playSchemes: Scheme[]
}

export interface EffectResult {
  effectAppointments: Scheme[]
  effectChoices: Choice[]
  effectDeck: Scheme[]
  effectDiscard: Scheme[]
  effectGold: number
  effectSilver: number
  effectHand: Scheme[]
  effectPlayerEvents: HistoryEvent[]
}

export interface SerializedEffect {
  effectAppointments: SchemeRef[]
  effectChoices: Choice[]
  effectDeck: SchemeRef[]
  effectDiscard: SchemeRef[]
  effectGold: number
  effectSilver: number
  effectHand: SchemeRef[]
  effectPlayerEvents: HistoryEvent[]
}

export type SchemeEffect = (props: SchemeEffectProps) => EffectResult

export interface DrawResult {
  drawnHand: Scheme[]
  drawnDeck: Scheme[]
  drawnDiscard: Scheme[]
}

export interface DrawData extends DrawResult {
  deckDrawn: Scheme[]
  discardDrawn: Scheme[]
  flipped: boolean
  privelegeTaken: Scheme[]
}

export interface ReviveResult {
  revivedDiscard: Scheme[]
  revivedHand: Scheme[]
}

export interface ReviveData extends ReviveResult {
  revivedList: Scheme[]
}

export interface Grammar {
  count: string
  verb: string
  noun: string
  phrase: string
  object: string
  all: string
}

export interface Earning {
  gold: number
  silver: number
}
