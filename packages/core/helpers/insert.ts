import 'dotenv/config'
import { parseArgs } from 'node:util'
import { getTableName } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import { eqlClient } from '../eql'
import { LockContext } from '@cipherstash/jseql/identify'

const cts_token = {
  accessToken:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5WWUNzLUc5cmJoa2FJTzlWcUtILXpQbjhFdmVqNUxUZ2gzZHRqcHBhWDgifQ.eyJ3b3Jrc3BhY2UiOiJ3czpMSUlKVkpDVEQ0NzJITE9DIiwiaXNzIjoiaHR0cHM6Ly9hcC1zb3V0aGVhc3QtMi5hd3MuYXV0aC5kcmV3LnZpdHVyaG9zdGVkLm5ldC8iLCJzdWIiOiJDU3x1c2VyXzJxYWZkdnNPWGc0dVd4Q2pCWWdnYUlqVTJjVCIsImF1ZCI6ImFwLXNvdXRoZWFzdC0yLmF3cy52aXR1cmhvc3RlZC5uZXQiLCJpYXQiOjE3MzcwNTc3MzYsImV4cCI6MTczNzA1NzkxNiwiYXpwIjoiT0lEQ3xkNTIwZDVjYy1iNzk2LTRlMDAtYTlmMC04MWI5MTI3NjkyMDYiLCJzY29wZSI6ImNvbmZpZzpyZWFkIGRhdGFfa2V5OmdlbmVyYXRlIGRhdGFfa2V5OnJldHJpZXZlIGRhdGFzZXQ6bGlzdCIsInJvbGVzIjpbIk1lbWJlciJdfQ.W0W6QYu9S45jnXkO94TxPq3vK9yMdMDYdLmXtzb88FksdHb0CiIDx7U8qxKUqGotNBaPklvCxHOst873zYU-5KsQ-QbcJ2i0G3DwKoL7c1n15CIXLEVoN6TIAUKvVgqXZYMpVlQ1yyzVfmyd5o3gPCOVqW5YEOhfDSlML4pa3aC4ig7D0KQ699rx6C751NyWxEWR39MaTwHZoBif6xqZ2hDqLwxsoQZ3kleX738Y1zig32h05nMmwAUNxBgPBifyZ37nmjav9rPRmZVs1UrB206K_VM4U5NjexoMS8rwWm1iA_K9RuyAS6o-XpAnfbIVyuzXgJJnL3nk23svtKMKps3Grx5jxtAaw5qIe0mB6G6p2RqBMbeQsq16-ohN9bnGHNF0Q2J1npq_RZyZMwx4kyTR7lMST3mJe-Mi2NUGxgzQf1mCVnNx0sR_GM_FUp3S9GpbFxU1ouapT1AV-DuzV5f_j0rHkF8Aw8an3NY2qNPSrwL1XVWIf62Xd5FdqfYYtBt3b7ahhPwuVTyM2vBlCH1GtMBQWHY1UzPf_2n-ETKv7aQGOthwevaPD6qLkQ8Uf1cohb8wfDjQiMFgEGdc8bkIMjQ2LBMqdGTfE2E_0T7HD7590ahQvQcswROYiq5vjPH0I8MmfmiirbzaMkbGU3lqiTWe4tk2sdvskagzJ1g',
  expiry: 1737057916,
}

const getUser = () => {
  const { values } = parseArgs({
    args: process.argv,
    options: {
      email: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
    },
    strict: true,
    allowPositionals: true,
  })

  return {
    name: values.name,
    email: values.email,
  }
}

const main = async () => {
  const { name, email } = getUser()

  if (!email || !name) {
    throw new Error('Email and name are required')
  }

  const lockContext = new LockContext({
    ctsToken: cts_token,
  })

  const encryptedEmail = await eqlClient.encrypt(email, {
    column: users.email.name,
    table: getTableName(users),
  })

  console.log('[INFO] Encrypted email:', encryptedEmail)

  const sql = db.insert(users).values({
    name: name,
    email: encryptedEmail,
    role: 'admin',
  })

  const sqlResult = sql.toSQL()
  console.log('[INFO] SQL statement:', sqlResult)

  await sql.execute()
  console.log(
    "[INFO] You've inserted a new user with an encrypted email from the plaintext",
    email,
  )

  process.exit(0)
}

main()
