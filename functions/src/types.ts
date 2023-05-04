import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'
import { ArrayUnionOrRemove, MetaType } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[]
  timestamp: number
  id: string
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
  id: string
  playerId: string
  type: ChoiceType
  first?: SchemeRef
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
  playScheme: SchemeRef | DeleteField
  trashScheme: SchemeRef | DeleteField
  userId: string
}, 'players', string>

export interface CurrentGameGuard {
  currentGameData: Game['read']
  currentGameRef: DocumentReference<Game>
  currentUid: string
  currentUserRef: DocumentReference<User>
}

export interface CurrentPlayingGuard {
  currentUid: string
  currentGame: Result<Game>
  currentGameRef: DocumentReference<Game>
  currentPlayer: Result<Player>
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

export interface CurrentHandGuard extends CurrentPlayingGuard {
  scheme: Scheme
  schemeRef: SchemeRef
}

export interface ChoiceGuard extends CurrentHandGuard {
  choice: Choice
  schemeRef: SchemeRef
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
  summons: Scheme[]
  choices: Choice[]
  deck: Scheme[]
  discard: Scheme[]
  dungeon: Scheme[]
  copiedByFirstEffect?: boolean | undefined
  gold: number
  silver: number
  passedTimeline: Scheme[]
  hand: Scheme[]
  playerId: string
  playSchemeRef: SchemeRef
  playSchemes: Scheme[]
  resume?: boolean | undefined
}

export interface EffectResult {
  effectSummons: Scheme[]
  effectChoices: Choice[]
  effectDeck: Scheme[]
  effectDiscard: Scheme[]
  effectGold: number
  effectSilver: number
  effectHand: Scheme[]
  effectPlayerEvents: HistoryEvent[]
}

export interface SerializedEffect {
  effectSummons: SchemeRef[]
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
  privilegeTaken: Scheme[]
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

export interface PlayResult {
  playerEvents: HistoryEvent[]
  playerChanges: Partial<Player['writeFlatten']>
  playerResult: Result<Player>
  profileChanges: Partial<Profile['writeFlatten']>
}

export interface PlayChanges {
  playerChanges: Partial<Player['writeFlatten']>
  profileChanges: Partial<Profile['writeFlatten']>
  profileChanged: boolean
}

export type EffectResultChanges = SerializedEffect & PlayChanges

export interface EffectResultGuard {
  oldDeck: Scheme[]
  oldDiscard: Scheme[]
  oldDungeon: Scheme[]
  oldHand: Scheme[]
  oldPlayers: Array<Result<Player>>
  passedTimeline: Scheme[]
  effectResult: EffectResult
}

export interface HighsGuard {
  high: Scheme
  highEvent: HistoryEvent
  highRank: string
  highRef: SchemeRef
  highRefs: SchemeRef[]
  highs: Scheme[]
}

export type Write <Collection extends MetaType> = Partial<Collection['writeFlatten']>

export interface PlayState {
  game: Result<Game>
  players: Array<Result<Player>>
}
