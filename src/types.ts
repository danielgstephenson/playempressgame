import { HttpsCallableResult } from 'firebase/functions'

export interface Doc {
  id?: string
}

export interface Scheme {
  id: string
  rank: number
}

export interface Game extends Doc {
  name: string
  phase: string
  timeline: Scheme[]
  court: Scheme[]
  dungeon: Scheme[]
  userIds: string[]
  readyCount: number
  createdAt: {
    seconds: number
    nanoseconds: number
  }
}

export interface Profile extends Doc {
  gameId: string
  userId: string
  displayName: string
  gold?: number
  topDiscard?: Scheme
  deckEmpty?: boolean
  trashEmpty?: boolean
  playEmpty?: boolean
  ready?: boolean
}

export interface Player extends Doc {
  deck: Scheme[]
  discard: Scheme[]
  gameId: string
  hand: Scheme[]
  userId: string
  trashId?: string
  playId?: string
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
