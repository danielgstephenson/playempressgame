import { Auth, User } from 'firebase/auth'
import { HttpsCallableResult } from 'firebase/functions'

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

export interface Scheme {
  id: string
  rank: number
}

export interface HistoryEvent {
  message: string
  children?: HistoryEvent[]
  timestamp: number
}

export interface GameUser {
  id: string
  displayName: string
}

export interface Game extends Doc {
  name: string
  phase: string
  timeline: Scheme[]
  court: Scheme[]
  dungeon: Scheme[]
  users: GameUser[]
  readyCount: number
  history: HistoryEvent[]
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}

export interface Profile extends Doc {
  deckEmpty?: boolean
  gameId: string
  userId: string
  displayName: string
  gold: number
  topDiscard?: Scheme
  trashEmpty?: boolean
  playEmpty?: boolean
  ready?: boolean
  silver: number
}

export interface Player extends Doc {
  deck: Scheme[]
  discard: Scheme[]
  gameId: string
  gold: number
  hand: Scheme[]
  userId: string
  trashId?: string
  playId?: string
  history: HistoryEvent[]
  displayName: string
  silver: number
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
