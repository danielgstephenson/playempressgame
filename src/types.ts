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

export type ChoiceType = 'trash' | 'deck'

export interface Choice {
  playerId: string
  type: ChoiceType
}

export interface Game extends Doc {
  choices: Choice[]
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  court: Scheme[]
  dungeon: Scheme[]
  history: HistoryEvent[]
  name: string
  phase: string
  readyCount: number
  timeline: Scheme[]
  users: GameUser[]
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
  trashScheme?: Scheme
  playScheme?: Scheme
  history: HistoryEvent[]
  displayName: string
  silver: number
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
