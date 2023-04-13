import { ServerTimestamp, MetaTypeCreator, DocumentReference, DeleteField, PossiblyReadAsUndefined } from 'firelord'

export interface HistoryEvent {
  message: string
  children: HistoryEvent[] | undefined
  timestamp: number
}

export interface Scheme {
  id: string
  rank: number
}

export type GameData = {
  name: string,
  createdAt: ServerTimestamp,
  phase: string,
  userIds: string[],
  court: Scheme[],
  dungeon: Scheme[],
  timeline: Scheme[],
  history: HistoryEvent[],
  readyCount: number
}
export type Game = MetaTypeCreator<GameData, 'games', string>

export type UserData = {
  displayName: string
  uid: string
}
export type User = MetaTypeCreator<UserData, 'users', string>

export type ProfileData = {
  userId: string
  gameId: string
  deckEmpty: boolean | PossiblyReadAsUndefined
  displayName: string
  topDiscardScheme: Scheme | DeleteField
  gold: number | PossiblyReadAsUndefined
  trashEmpty: boolean | DeleteField
  playEmpty: boolean | DeleteField
  ready: boolean | DeleteField
}
export type Profile = MetaTypeCreator<ProfileData, 'profiles', string>

export type PlayerData = {
  userId: string
  gameId: string
  hand: Scheme[]
  deck: Scheme[]
  discard: Scheme[]
  history: HistoryEvent[]
  displayName: string
  trashId: string | DeleteField
  playId: string | DeleteField
}
export type Player = MetaTypeCreator<PlayerData, 'players', string>

export interface JoinedGameGuard {
  gameData: Game['read']
  gameRef: DocumentReference<Game>
  currentUid: string
  userRef: DocumentReference<User>
}

export interface PlayerGuard {
  currentUid: string
  gameData: Game['read']
  gameRef: DocumentReference<Game>
  playerData: Player['read']
  playerId: string
  playerRef: DocumentReference<Player>
  profileRef: DocumentReference<Profile> 
}

export interface AddGameProps {
  displayName: string
}

export interface JoinGameProps {
  gameId: string
}

export interface StartGameProps {
  gameId: string
}

export interface TrashSchemeProps {
  gameId: string
  schemeId: string
}

export interface PlaySchemeProps {
  gameId: string
  schemeId: string
}

export interface UnplaySchemeProps {
  gameId: string
  schemeId: string
}

export interface UntrashSchemeProps {
  gameId: string
  schemeId: string
}

export interface PlayReadyProps {
  gameId: string
}

export interface PlayUnreadyProps {
  gameId: string
}