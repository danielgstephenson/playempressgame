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
  children?: HistoryEvent[]
  timestamp: number
}

export interface TrashEvent {
  round: number
}

export interface PrivateTrashEvent extends TrashEvent {
  scheme: Scheme
}

export interface Profile {
  userId: string
  gameId: string
  deckEmpty: boolean
  displayName: string
  topDiscardScheme?: Scheme | undefined
  gold: number
  silver: number
  ready: boolean
  trashHistory: TrashEvent[]
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
  history: HistoryEvent[]
  name: string
  phase: string
  readyCount: number
  round: number
  profiles: Profile[]
  timeline: Scheme[]
}

export interface Player extends Doc {
  deck: Scheme[]
  discard: Scheme[]
  displayName: string
  gameId: string
  gold: number
  silver: number
  hand: Scheme[]
  history: HistoryEvent[]
  playScheme?: Scheme
  trashScheme?: Scheme
  trashHistory: PrivateTrashEvent[]
  userId: string
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
