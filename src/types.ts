import { HttpsCallableResult } from 'firebase/functions'

export interface Doc {
  id?: string
}

export interface Game extends Doc {
  name: string
  phase: string
}

export interface Profile extends Doc {
  gameId: string
  userId: string
}

export type FunctionCaller = (data?: unknown) => Promise<HttpsCallableResult<unknown> | undefined>
