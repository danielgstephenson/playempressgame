import { Auth, User } from 'firebase/auth'
import { HttpsCallableResult } from 'firebase/functions'
import { Timestamp } from 'firebase/firestore'

export interface AuthState {
  auth?: Auth
  authed?: boolean
  currentUser?: User | null
  currentUserLoading?: Boolean
  currentUserError?: Error | undefined
  displayName?: string
  setSignOutErrorMessage?: (message: string) => void
  signOutErrorMessage?: string
  unauth?: () => Promise<boolean>
  unauthLoading?: boolean
}

export interface Doc {
  id?: string
}
export type SchemeColor = 'green' | 'yellow' | 'red'
export interface Scheme {
  id: string
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

export interface HistoryEvent {
  message: string
  events?: HistoryEvent[]
  timestamp: number
}

export interface TrashEvent {
  round: number
}

export interface PrivateTrashEvent extends TrashEvent {
  scheme: Scheme
}

export interface Profile {
  auctionReady: boolean
  bid: number
  deckEmpty: boolean
  displayName: string
  gameId: string
  gold: number
  lastBidder: boolean
  playReady: boolean
  playScheme?: Scheme | undefined
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
}

export interface Game extends Doc{
  choices: Choice[]
  createdAt: Timestamp
  court: Scheme[]
  dungeon: Scheme[]
  events: HistoryEvent[]
  name: string
  phase: string
  readyCount: number
  round: number
  profiles: Profile[]
  timeline: Scheme[]
}

export interface Player extends Doc {
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
  playScheme?: Scheme
  silver: number
  tableau: Scheme[]
  trashScheme?: Scheme
  trashHistory: PrivateTrashEvent[]
  userId: string
  withdrawn: boolean
  playReady: boolean
}

export type FunctionCaller = (data?: unknown) =>
Promise<HttpsCallableResult<unknown> | undefined>

export interface Play {
  emptyPlay?: () => void
  emptyTrash?: () => void
  play?: (scheme: Scheme | undefined) => void
  playScheme?: Scheme
  taken?: string[]
  take?: (schemeId: string) => void
  leave?: (schemeId: string) => void
  trash?: (scheme: Scheme | undefined) => void
  trashScheme?: Scheme
}

export interface DisplayNameState {
  displayName?: string
  setDisplayName: (displayName: string | undefined) => void
}
