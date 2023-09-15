import { createId } from "@paralleldrive/cuid2"
import { Database, Statement } from "bun:sqlite"

interface User {
  id: string
  name: string
  email: string
  password: string
}

export function LocalDatabase(path: string) {
  const db = new Database(path)

  db.query(
    `create table if not exists users (id string primary key, name text, email text, password text)`
  ).run()
  db.query(
    `create table if not exists sessions (id string primary key, expiresAt int not null, userID string null, csrfToken text null)`
  ).run()
  db.query(`create unique index if not exists idx_users_email on users(email)`).run()

  const updateSessionCSRFTokenQuery = db.query(
    `update sessions set csrfToken = $csrfToken, expiresAt = unixepoch() + 86400 where id = $sessionID`
  )

  const findSessionQuery = db.query(
    `select csrfToken, userID, expiresAt from sessions where id = $sessionID`
  )

  const insertSessionQuery = db.query(
    `insert into sessions (id, expiresAt, csrfToken) values ($sessionID, unixepoch() + 86400, $csrfToken)`
  )

  const insertUserQuery = db.query(
    "insert into users (id, name, email, password) values ($id, $name, $email, $password)"
  )

  const deleteSessionQuery = db.query(`delete from sessions where id = $sessionID`)

  const deleteExpiredSessionsQuery = db.query(`delete from sessions where expiresAt < unixepoch()`)

  const updateSessionExpiryQuery = db.query(
    `update sessions set expiresAt = unixepoch() + 86400 where id = $sessionID`
  )

  const updateSessionWithUserIDQuery = db.query(
    `update sessions set userID = $userID, csrfToken = null where id = $sessionID`
  )

  const findUserByQuery = db.query(
    `select id, name, email, password from users where email = $email`
  )

  return {
    FindSession: (sessionID: string) => {
      if (!sessionID) return null
      return findSessionQuery.get({ $sessionID: sessionID }) as {
        expiresAt: number
        csrfToken: string | null
        userID: string | null
      } | null
    },

    RotateCSRFToken: (sessionID: string) => {
      let csrfToken = createId()
      updateSessionCSRFTokenQuery.run({ $sessionID: sessionID, $csrfToken: csrfToken })
      return csrfToken
    },

    InsertSession: (sessionID: string, csrfToken: string | null) => {
      insertSessionQuery.run({ $csrfToken: csrfToken, $sessionID: sessionID })
    },

    UpdateSessionExpiry: (sessionID: string) => {
      updateSessionExpiryQuery.run({ $sessionID: sessionID })
    },

    UpdateSessionWithUserID: (sessionID: string, userID: string) => {
      updateSessionWithUserIDQuery.run({ $sessionID: sessionID, $userID: userID })
    },

    DeleteSession: (sessionID: string) => {
      deleteSessionQuery.run({ $sessionID: sessionID })
    },

    DeleteExpiredSessions: () => {
      deleteExpiredSessionsQuery.run()
    },

    InsertUser: (id: string, name: string, email: string, password: string) => {
      insertUserQuery.run({ $id: id, $name: name, $email: email, $password: password })
    },

    FindUserByEmail: (email: string) => {
      return findUserByQuery.get({ $email: email }) as User | null
    },
  }
}
