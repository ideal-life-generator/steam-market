import crypto from "crypto"

// CREATE TABLE users (
//   "id" SERIAL UNIQUE,
//   "steamId" TEXT,
//   "token" TEXT
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

function exist (db, steamId, existCallback) {
  db.query(`
    SELECT EXISTS(SELECT 1 FROM users WHERE "steamId"='${steamId}');
  `, (err, result) => {
    if (err) { throw err }
    else {
      const { rows: [ { exists: exist } ] } = result
      existCallback(exist)
    }
  })
}

function get (db, steamId, getCallback) {
  const tokenBase64 = crypto.randomBytes(16, "base64")
  const token = tokenBase64.toString("base64")
  db.query(`
    SELECT * FROM users WHERE
      "steamId"='${steamId}'
    LIMIT 1;
  `, (err, result) => {
    if (err) { throw err }
    else {
      const { rows: [ user ] } = result
      getCallback(user)
    }
  })
}

function create (db, steamId, createCallback) {
  const tokenBase64 = crypto.randomBytes(16, "base64")
  const token = tokenBase64.toString("base64")
  db.query(`
    INSERT INTO users (
      "steamId",
      "token"
    )
    SELECT
      '${steamId}',
      '${token}'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE "steamId"='${steamId}')
    RETURNING *;
  `, (err, result) => {
    if (err) { throw err }
    else {
      const { rows: [ user ] } = result
      const isCreated = user ? true : false
      createCallback(isCreated)
    }
  })
}

function updateToken (db, steamId, updateTokenCallback) {
  const tokenBase64 = crypto.randomBytes(16, "base64")
  const token = tokenBase64.toString("base64")
  db.query(`
    UPDATE users SET
      token='${token}'
    WHERE "steamId"='${steamId}'
    RETURNING *;
  `, (err, result) => {
    if (err) { throw err }
    else {
      const { rows: [ user ] } = result
      const isUpdatedToken = user ? true : false
      updateTokenCallback(isUpdatedToken)
    }
  })
}

export { exist, get, create, updateToken }