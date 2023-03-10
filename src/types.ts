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
}

export interface Profile extends Doc {
  gameId: string
  userId: string
}

export interface Player extends Doc {
  deck: number[]
  discard: number[]
  gameId: string
  hand: number[]
  userId: string
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
