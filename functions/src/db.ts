import { getFirelord, getFirestore } from 'firelord'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { firebaseConfig } from './secret'
import { Game, Player, Profile, User } from './types'

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
