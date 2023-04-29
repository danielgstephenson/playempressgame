// import * as admin from "firebase-admin";
import addGame from './cloudFunction/addGame'
import joinGame from './cloudFunction/joinGame'
import startGame from './cloudFunction/startGame'
import onCreateUser from './cloudFunction/onCreateUser'
import onDeleteUser from './cloudFunction/onDeleteUser'
import playTrash from './cloudFunction/playTrash'
import playPlay from './cloudFunction/playPlay'
import playUntrash from './cloudFunction/playUntrash'
import playUnplay from './cloudFunction/playUnplay'
import playReady from './cloudFunction/playReady'
import playUnready from './cloudFunction/playUnready'
import deckChoose from './cloudFunction/deckChoose'
import trashChoose from './cloudFunction/trashChoose'

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
exports.addGame = addGame
exports.deckChoose = deckChoose
exports.joinGame = joinGame
exports.onCreateUser = onCreateUser
exports.onDeleteUser = onDeleteUser
exports.playPlay = playPlay
exports.playReady = playReady
exports.playTrash = playTrash
exports.playUntrash = playUntrash
exports.playUnplay = playUnplay
exports.playUnready = playUnready
exports.startGame = startGame
exports.trashChoose = trashChoose
