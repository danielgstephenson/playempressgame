import { HttpsCallableResult } from 'firebase/functions'

export interface Doc {
  id?: string
}

export interface Game extends Doc {
  name: string
  phase: string
  timeline: number[]
  court: number[]
  dungeon: number[]
  userIds: string[]
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
  topDiscard?: number
  deckEmpty?: boolean
  trashEmpty?: boolean
  playEmpty?: boolean
  ready?: boolean
}

export interface Player extends Doc {
  deck: number[]
  discard: number[]
  gameId: string
  hand: number[]
  userId: string
  trashIndex?: number
  playIndex?: number
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
