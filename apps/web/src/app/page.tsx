import Header from '../components/Header'
import UserTable from '../components/UserTable'
import { users } from '@jseql-next-drizzle/core/db/schema'
import { db } from '@jseql-next-drizzle/core/db'
import { eqlClient, getLockContext } from '@jseql-next-drizzle/core/eql'
import { auth } from '@clerk/nextjs/server'
import { getCtsToken } from '@cipherstash/nextjs'

export type EqlPayload = {
  c: string // Ciphertext
}

export type EncryptedUser = {
  id: number
  name: string
  email: string | null
  role: string
}

async function getUsers(): Promise<EncryptedUser[]> {
  const { userId } = await auth()
  const cts_token = await getCtsToken()
  const lockContext = getLockContext(cts_token)

  try {
    const results = await db.select().from(users).limit(500)

    if (userId) {
      const dataToDecrypt = results.map((row) => {
        return {
          id: row.id,
          c: (row.email as { c: string }).c,
        }
      })

      const data = await Promise.all(
        results.map(
          async (row) =>
            await eqlClient.decrypt(row.email as { c: string }, {
              lockContext,
            }),
        ),
      )

      return results.map((row, index) => ({
        ...row,
        email: data[index] || '',
      }))
    }

    return results.map((row) => ({
      id: row.id,
      name: row.name,
      email: (row.email as { c: string })?.c,
      role: row.role,
    }))
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users.')
  }
}

export default async function Home() {
  const users = await getUsers()

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow px-6 py-8">
        <UserTable users={users} />
      </div>
    </main>
  )
}
