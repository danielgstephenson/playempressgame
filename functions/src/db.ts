import { getFirelord, getFirestore } from 'firelord'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { firebaseConfig } from './secret'
import { Game, Player, Profile, User } from './types'
import effectZero from './effect/zero'

admin.initializeApp(firebaseConfig)
export const adminAuth = getAuth()
export const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })
export const gamesRef = getFirelord<Game>(db, 'games')
export const usersRef = getFirelord<User>(db, 'users')
export const profilesRef = getFirelord<Profile>(db, 'profiles')
export const playersRef = getFirelord<Player>(db, 'players')
export const green = [0, 1, 2, 3, 4, 5, 6, 23, 24, 25]
export const red = [8, 9, 10, 11, 12, 13, 14, 15]
export const yellow = [16, 17, 18, 19, 20, 21, 22]
export const times = [3, 3, 3, 1, 3, 0, 0, 1, 0, 3, 3, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2]
export const effects = [
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero,
  effectZero
]
