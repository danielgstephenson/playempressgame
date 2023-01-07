import { https } from 'firebase-functions'
import hello from './hello'
import addGame from './addGame'

exports.helloWorld = https.onCall(hello)
exports.addGame = https.onCall(addGame)

