import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField } from 'firelord'
import { ArrayUnionOrRemove, MetaType } from 'firelord/dist/types'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[]
  timestamp: number
  id: string
  round?: number
  playerId?: string
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
}
export interface Scheme extends SchemeData {
  id: string
}

export type Result <Collection extends MetaType> = Collection['read'] & { id: string }

export interface Profile {
  userId: string
  gameId: string
  deckEmpty: boolean
  displayName: string
  topDiscardScheme?: Scheme | undefined
  gold: number
  silver: number
  ready: boolean
  trashHistory: PublicTrashEvent[]
}

export type ChoiceType = 'trash' | 'deck'

export interface Choice {
  readonly id: string
  readonly playerId: string
  readonly type: ChoiceType
  readonly first?: Scheme
}

export type Game = MetaTypeCreator<{
  choices: Choice[]
  createdAt: ServerTimestamp
  court: Scheme[]
  dungeon: Scheme[]
  history: HistoryEvent[]
  name: string
  phase: string
  readyCount: number
  round: number
  profiles: Profile[]
  timeline: Scheme[]
}, 'games', string>

export type User = MetaTypeCreator<{
  displayName: string
  uid: string
}, 'users', string>

export interface PublicTrashEvent {
  round: number
}

export interface PrivateTrashEvent extends PublicTrashEvent {
  scheme: Scheme
}

export type Player = MetaTypeCreator<{
  deck: Scheme[]
  discard: Scheme[]
  displayName: string
  gameId: string
  gold: number
  silver: number
  hand: Scheme[]
  history: HistoryEvent[]
  playScheme: Scheme | DeleteField
  trashScheme: Scheme | DeleteField
  trashHistory: PrivateTrashEvent[]
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
  currentProfile: Profile
}

export interface GameProps {
  gameId: string
}

export interface PlayReadyProps extends GameProps {
  trashSchemeId: string
  playSchemeId: string
}

export interface SchemeProps extends GameProps {
  schemeId: string
}

export interface HistoryUpdate {
  history: ArrayUnionOrRemove<HistoryEvent>
}

export interface CurrentHandGuard extends CurrentPlayingGuard {
  scheme: Scheme
}

export interface ChoiceGuard extends CurrentHandGuard {
  choice: Choice
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
  playState: PlayState
  copiedByFirstEffect: boolean
  effectPlayer: Result<Player>
  effectScheme: Scheme
  resume: boolean
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
  effectSummons: Scheme[]
  effectChoices: Choice[]
  effectDeck: Scheme[]
  effectDiscard: Scheme[]
  effectGold: number
  effectSilver: number
  effectHand: Scheme[]
  effectPlayerEvents: HistoryEvent[]
}

export type SchemeEffect = (props: SchemeEffectProps) => PlayState

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
  toBe: string
  noun: string
  toBeCount: string
  object: string
  all: string
}

export interface GetJoinedRanksGrammar {
  grammar: Grammar
  joinedRanks: string
  joinedCount: string
}

export interface Earning {
  gold: number
  silver: number
}

export interface PlayResult {
  playerEvents: HistoryEvent[]
  playerChanges: Partial<Player['writeFlatten']>
  playerResult: Result<Player>
}

export interface PlayChanges {
  playerChanges: Partial<Player['writeFlatten']>
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
  highRef: Scheme
  highRefs: Scheme[]
  highs: Scheme[]
}

export type Write <Collection extends MetaType> =
Partial<Collection['writeFlatten']>

export interface PlayState {
  game: Result<Game>
  players: Array<Result<Player>>
}

export interface EffectsStateProps {
  copiedByFirstEffect: boolean
  playState: PlayState
  effectPlayer: Result<Player>
  effectScheme: Scheme
  resume: boolean
}

export interface PlayerEvent extends HistoryEvent {
  playerId: string
}

export interface PublicEvents {
  observerEvent: HistoryEvent
  otherPlayerEvents: PlayerEvent[]
}

export interface PlayEvents {
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
}

export interface PlayTimeEvents {
  time: number
  playTimeEvents: PlayEvents
}

export interface SchemePlayEvents {
  scheme: Scheme
  playEvents: PlayEvents
}

export interface MaybeSchemePlayEvents {
  scheme?: Scheme
  playEvents: PlayEvents
}

export interface MaybeSchemesPlayEvents {
  schemes?: Scheme[]
  playEvents: PlayEvents
}
