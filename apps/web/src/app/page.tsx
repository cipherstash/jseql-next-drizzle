import Header from '../components/Header'
import UserTable from '../components/UserTable'
import { users } from '@jseql-next-drizzle/core/db/schema'
import { db } from '@jseql-next-drizzle/core/db'
import { eqlClient } from '@jseql-next-drizzle/core/eql'
import { auth } from '@clerk/nextjs/server'

export type EqlPayload = {
  c: string // Ciphertext
}

export type EncryptedUser = {
  id: number
  name: string
  email: EqlPayload
  role: string
}

async function getUsers(): Promise<EncryptedUser[]> {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth()

  try {
    const results = await db.select().from(users).limit(10)

    if (userId) {
      // Query DB for user specific information or display assets only to signed in users
      const data = await Promise.all(
        results.map(
          async (row) => await eqlClient.decrypt(row.email as { c: string }),
        ),
      )

      // TODO: Clean this function up
      return results.map((row, index) => ({
        ...row,
        email: data[index],
      }))
    }

    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix up types and don't use `any` here.
    return results as any
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
