import { Auth, User } from 'firebase/auth'
import { HttpsCallableResult } from 'firebase/functions'
import { Timestamp } from 'firebase/firestore'
import React, { CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { UniqueIdentifier, useDraggable } from '@dnd-kit/core'
import { SystemStyleObject } from '@chakra-ui/react'

export interface AuthState {
  auth?: Auth
  authed?: boolean
  currentUser?: User | null
  currentUserLoading?: Boolean
  currentUserError?: Error | undefined
  displayName?: string
  named?: boolean
  setSignOutErrorMessage?: (message: string) => void
  signOutErrorMessage?: string
  signOutLoading?: boolean
  unauth?: () => Promise<boolean>
  userId?: string
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
  label1: string
  label2: string
  link1: string
  link2: string
  icon2: string
  icon3: string
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
  deck?: Scheme[]
  deckEmpty: boolean
  discard?: Scheme[]
  displayName: string
  gameId: string
  gold: number
  hand?: Scheme[]
  lastBidder: boolean
  playReady: boolean
  playScheme: Scheme | undefined
  silver: number
  tableau: Scheme[]
  topDiscardScheme?: Scheme | undefined
  trashHistory: TrashEvent[]
  privateTrashHistory: PrivateTrashEvent[]
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
  imprisoned: boolean
  name: string
  phase: 'auction' | 'play' | 'join'
  readyCount: number
  round: number
  profiles: Profile[]
  timeline: Scheme[]
  timePassed: boolean
  final: boolean
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
  court?: Scheme[]
  deck?: Scheme[]
  deckChoiceId?: string
  dungeon?: Scheme[]
  emptyPlay?: () => void
  emptyTrash?: () => void
  hand?: Scheme[]
  handClone?: Scheme[]
  overCourt?: boolean
  overDeck?: boolean
  overDungeon?: boolean
  overPlay?: boolean
  overTableau?: boolean
  overTrash?: boolean
  playSchemeId?: string
  resetTaken?: () => void
  setCourt?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setDeck?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setDeckChoiceId?: React.Dispatch<React.SetStateAction<string | undefined>>
  setDungeon?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setHand?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setHandClone?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setOverCourt?: React.Dispatch<React.SetStateAction<boolean>>
  setOverDeck?: React.Dispatch<React.SetStateAction<boolean>>
  setOverDungeon?: React.Dispatch<React.SetStateAction<boolean>>
  setOverPlay?: React.Dispatch<React.SetStateAction<boolean>>
  setOverTableau?: React.Dispatch<React.SetStateAction<boolean>>
  setOverTrash?: React.Dispatch<React.SetStateAction<boolean>>
  setPlaySchemeId?: React.Dispatch<React.SetStateAction<string | undefined>>
  setTableau?: React.Dispatch<React.SetStateAction<Scheme[]>>
  setTrashChoiceId?: React.Dispatch<React.SetStateAction<string | undefined>>
  setTrashSchemeId?: React.Dispatch<React.SetStateAction<string | undefined>>
  tableau?: Scheme[]
  taken?: string[]
  take?: (schemeId: string) => void
  leave?: (schemeId: string) => void
  trashChoiceId?: string
  trashSchemeId?: string
}

export interface DisplayNameState {
  displayName?: string
  setDisplayName: (displayName: string | undefined) => void
}
export interface Identified {
  id: UniqueIdentifier
}
export type DndDraggable = ReturnType<typeof useDraggable> & {
  style: CSSProperties
}
export type DndSortable = ReturnType<typeof useSortable> & {
  style: CSSProperties
}
export interface ButtonDetails {
  bg: string
  color: string
  label: string
}

export interface SchemeStyles {
  bg?: string
  border?: string
  color?: string
  _hover?: SystemStyleObject | undefined
}
