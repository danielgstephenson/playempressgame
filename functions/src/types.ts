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
  bid: number
  deckEmpty: boolean
  displayName: string
  gameId: string
  gold: number
  silver: number
  topDiscardScheme?: Scheme | undefined
  trashHistory: TrashEvent[]
  userId: string
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

export interface TrashEvent {
  round: number
}

export interface PrivateTrashEvent extends TrashEvent {
  scheme: Scheme
}

export type Player = MetaTypeCreator<{
  bid: number
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
  ready: boolean
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

export interface HistoryUpdate {
  history: ArrayUnionOrRemove<HistoryEvent>
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
  joinedRanks: string
  joinedCount: string
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
  scheme?: Scheme
  playEvents: PlayEvents
}

export interface MaybeSchemesPlayEvents {
  schemes?: Scheme[]
  playEvents: PlayEvents
}
