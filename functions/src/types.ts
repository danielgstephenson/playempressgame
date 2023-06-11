import { https } from 'firebase-functions'
import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, Transaction, MetaType } from 'firelord'
import { ArrayUnionOrRemove } from 'firelord/dist/types'

export interface EventContainer {
  events: HistoryEvent[]
}

export interface HistoryEvent extends EventContainer {
  message: string
  events: HistoryEvent[]
  timestamp: number
  id: string
  round?: number
  playerId?: string
}
export type SchemeColor = 'green' | 'yellow' | 'red'
export interface SchemeData {
  rank: number
  color: SchemeColor
  time: number
}
export interface Scheme extends SchemeData {
  id: string
}

export type Result <Collection extends MetaType> = Collection['read'] & { id: string }

export interface Profile {
  auctionReady: boolean
  bid: number
  deckEmpty: boolean
  displayName: string
  gameId: string
  gold: number
  lastBidder: boolean
  playReady: boolean
  silver: number
  tableau: Scheme[]
  topDiscardScheme?: Scheme | undefined
  trashHistory: TrashEvent[]
  userId: string
  withdrawn: boolean
}

export type ChoiceType = 'trash' | 'deck'

export interface Choice {
  readonly id: string
  readonly playerId: string
  readonly type: ChoiceType
  readonly first?: Scheme
  readonly threat?: Scheme
}

export type Game = MetaTypeCreator<{
  choices: Choice[]
  createdAt: ServerTimestamp
  court: Scheme[]
  dungeon: Scheme[]
  events: HistoryEvent[]
  name: string
  phase: string
  round: number
  profiles: Profile[]
  timeline: Scheme[]
}, 'games', string>

export type User = MetaTypeCreator<{
  displayName: string
  uid: string
}, 'users', string>

export interface TrashEvent {
  round: number
}

export interface PrivateTrashEvent extends TrashEvent {
  scheme: Scheme
}

export type Player = MetaTypeCreator<{
  auctionReady: boolean
  bid: number
  deck: Scheme[]
  discard: Scheme[]
  displayName: string
  events: HistoryEvent[]
  gameId: string
  gold: number
  hand: Scheme[]
  lastBidder: boolean
  playScheme: Scheme | DeleteField
  silver: number
  tableau: Scheme[]
  trashScheme: Scheme | DeleteField
  trashHistory: PrivateTrashEvent[]
  userId: string
  withdrawn: boolean
  playReady: boolean
}, 'players', string>

export interface CurrentGameGuard {
  currentGameData: Game['read']
  currentGameRef: DocumentReference<Game>
  currentUid: string
  currentUserRef: DocumentReference<User>
}

export interface CurrentPlayerGuard {
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

export interface BidProps extends GameProps {
  bid: number
}

export interface PlayReadyProps extends GameProps {
  trashSchemeId: string
  playSchemeId: string
}

export interface SchemeProps extends GameProps {
  schemeId: string
}

export interface SchemesProps extends GameProps {
  schemeIds: string[]
}

export interface HistoryUpdate {
  events: ArrayUnionOrRemove<HistoryEvent>
}

export interface CurrentHandGuard extends CurrentPlayerGuard {
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

export interface SchemeEffectProps {
  copiedByFirstEffect: boolean
  effectPlayer: Result<Player>
  effectScheme: Scheme
  playState: PlayState
  privateEvent: HistoryEvent
  publicEvents: PublicEvents
  resume: boolean
  threat?: Scheme | undefined
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
  all: string
  count: string
  noun: string
  object: string
  toBe: string
  toBeCount: string
  spelled: string
  possessiveSecond: string
  possessiveThird: string
}

export interface GetJoinedRanksGrammar {
  grammar: Grammar
  joinedCount: string
  joinedRanks: string
  joinedToBe: string
}

export interface Earning {
  gold: number
  silver: number
}

export type Write <Collection extends MetaType> =
Partial<Collection['writeFlatten']>

export interface PlayState {
  game: Result<Game>
  players: Array<Result<Player>>
}

export interface DrawState {
  allDrawn: Scheme[]
  beforePrivilegeHand: Scheme[]
  deckDrawn: Scheme[]
  deckDrawnDeck: Scheme[]
  deckDrawnHand: Scheme[]
  discardDrawn: Scheme[]
  discardDrawnDeck: Scheme[]
  discardDrawnHand: Scheme[]
  discardFlipped: boolean
  flippedDeck: Scheme[]
  playState: PlayState
  privilegeTaken: Scheme[]
}

export interface PlayerEvent extends HistoryEvent {
  playerId: string
}

export interface PublicEvents {
  observerEvent: HistoryEvent
  otherPlayerEvents: HistoryEvent[]
}

export interface PlayerPublicEvents extends PublicEvents {
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
  scheme?: Scheme | undefined
  playEvents?: PlayEvents | undefined
}

export interface MaybeSchemesPlayEvents {
  schemes?: Scheme[] | undefined
  playEvents?: PlayEvents | undefined
}

export type TransactionCallback <Props> = (
  props: Props,
  context: https.CallableContext,
  transaction: Transaction
) => Promise<unknown>

export type CloudCallback <Props> = TransactionCallback<Props> | Array<TransactionCallback<Props>>

export interface PlayerState {
  currentPlayer: Result<Player>
  observerEvent: HistoryEvent
  playerEvents: PlayerEvent[]
  playState: PlayState
}

export interface Messages {
  publicMessage: string
  privateMessage: string
}
