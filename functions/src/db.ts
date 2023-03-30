import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from './secret'

admin.initializeApp(firebaseConfig);
export const adminAuth = getAuth()
export const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })
export const gamesRef = db.collection('games')
export const usersRef = db.collection('users')
export const profilesRef = db.collection('profiles')
export const playersRef = db.collection('players')
export const green = [0, 1, 2, 3, 4, 5, 6, 23, 24, 25]
export const red = [8, 9, 10, 11, 12, 13, 14, 15]
export const yellow = [16, 17, 18, 19, 20, 21, 22]