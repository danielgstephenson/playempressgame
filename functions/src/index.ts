// import * as admin from "firebase-admin";
import addGame from './cloudFunction/addGame';
import joinGame from './cloudFunction/joinGame';
import startGame from './cloudFunction/startGame';
import onCreateUser from './cloudFunction/onCreateUser';
import onDeleteUser from './cloudFunction/onDeleteUser';

// process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'

exports.addGame = addGame 

exports.joinGame = joinGame

exports.startGame = startGame

exports.onCreateUser = onCreateUser

exports.onDeleteUser = onDeleteUser
