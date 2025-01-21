import 'dotenv/config'
import { parseArgs } from 'node:util'
import { getTableName } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import { eqlClient } from '../eql'
import { LockContext } from '@cipherstash/jseql/identify'

// You must create a CTS token and set the accessToken and expiry in order to use this helper function
const cts_token = {
  accessToken: '',
  expiry: 0,
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
    lockContext,
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
