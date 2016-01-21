import crypto from "crypto"

// CREATE TABLE users (
//   "id" SERIAL UNIQUE,
//   "steamId" TEXT,
//   "token" TEXT,
//   "walletId" INC
// );

// SELECT EXISTS(SELECT 1 FROM users WHERE "steamId"='76561198198917706');

// INSERT INTO users (
//   "steamId",
//   "token"
// )
// SELECT
//   '76561198198917706',
//   'DP+OQ8GKiuh55DIyGo02Xg==';
// WHERE NOT EXISTS (SELECT 1 FROM users WHERE "steamId"='76561198198917706');

// UPDATE users SET
//   token='DP+OQ8GKiuh55DIyGo02Xg=='
// WHERE "steamId"='76561198198917706';

// SELECT * FROM users WHERE "steamId"='76561198198917706' LIMIT 1;

const user = {
  exist (db, steamId, callback) {
    db.query(`
      SELECT EXISTS(SELECT 1 FROM users WHERE "steamId"=$1);
    `, [ steamId ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ { exists: isExist } ] } = result
        callback(isExist)
      }
    })
  },
  get (db, steamId, callback) {
    const tokenBase64 = crypto.randomBytes(16, "base64")
    const token = tokenBase64.toString("base64")
    db.query(`
      SELECT * FROM users WHERE
        "steamId"=$1
      LIMIT 1;
    `, [ steamId ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ user ] } = result
        callback(user)
      }
    })
  },
  create (db, steamId, callback) {
    const tokenBase64 = crypto.randomBytes(16, "base64")
    const token = tokenBase64.toString("base64")
    db.query(`
      INSERT INTO users (
        "steamId",
        "token"
      )
      SELECT
        $1,
        $2
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE "steamId"=$1)
      RETURNING *;
    `, [ steamId, token ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ user ] } = result
        const isCreated = user ? true : false
        callback(isCreated)
      }
    })
  },
  getToken (db, steamId, callback) {
    db.query(`
      UPDATE users SET
        token=$2
      WHERE "steamId"=$1
      RETURNING *;
    `, [ steamId, token ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ user ] } = result
        const isUpdatedToken = user ? true : false
        callback(isUpdatedToken)
      }
    })
  },
  updateToken (db, steamId, callback) {
    const tokenBase64 = crypto.randomBytes(16, "base64")
    const token = tokenBase64.toString("base64")
    db.query(`
      UPDATE users SET
        token=$2
      WHERE "steamId"=$1
      RETURNING *;
    `, [ steamId, token ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ user ] } = result
        const isUpdatedToken = user ? true : false
        callback(isUpdatedToken)
      }
    })
  },
  checkToken (db, steamId, token, callback) {
    db.query(`
      SELECT EXISTS(SELECT 1 FROM users WHERE "steamId"=$1 AND "token"=$2);
    `, [ steamId, token ], (err, result) => {
      if (err) { throw err }
      else {
        const { rows: [ { exists: isExist } ] } = result
        callback(isExist)
      }
    })
  }
}

export default user