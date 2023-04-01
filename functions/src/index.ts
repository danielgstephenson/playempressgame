// import * as admin from "firebase-admin";
import addGame from './cloudFunction/addGame';
import joinGame from './cloudFunction/joinGame';
import startGame from './cloudFunction/startGame';
import onCreateUser from './cloudFunction/onCreateUser';
import onDeleteUser from './cloudFunction/onDeleteUser';
import trashScheme from './cloudFunction/trashScheme';
import playScheme from './cloudFunction/playScheme';
import untrashScheme from './cloudFunction/untrashScheme';
import unplayScheme from './cloudFunction/unplayScheme';
import playReady from './cloudFunction/playReady';
import playUnready from './cloudFunction/playUnready';

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

exports.addGame = addGame 

exports.joinGame = joinGame

exports.startGame = startGame

exports.onCreateUser = onCreateUser

exports.onDeleteUser = onDeleteUser

exports.trashScheme = trashScheme

exports.playScheme = playScheme

exports.untrashScheme = untrashScheme

exports.unplayScheme = unplayScheme

exports.playReady = playReady

exports.playUnready = playUnready

