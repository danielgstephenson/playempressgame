import { getFirelord, getFirestore } from 'firelord'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { firebaseConfig } from './secret'
import { Game, Player, Profile, SchemeData, SchemeEffect, User } from './types'
import effectZero from './effect/zero'
import effectOne from './effect/one'
import effectTwo from './effect/two'
import effectThree from './effect/three'
import effectFour from './effect/four'
import effectFive from './effect/five'
import schemesJson from './schemes.json'
import effectSix from './effect/six'

admin.initializeApp(firebaseConfig)
export const adminAuth = getAuth()
export const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })
export const gamesRef = getFirelord<Game>(db, 'games')
export const usersRef = getFirelord<User>(db, 'users')
export const profilesRef = getFirelord<Profile>(db, 'profiles')
export const playersRef = getFirelord<Player>(db, 'players')
export const effects: SchemeEffect[] = [
  effectZero,
  effectOne,
  effectTwo,
  effectThree,
  effectFour,
  effectFive,
  effectSix,
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
export const schemeData: SchemeData[] = schemesJson.map((scheme, index) => {
  const effect = effects[index]
  return {
    ...scheme,
    effect
  }
})
