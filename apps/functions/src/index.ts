import { eqlClient } from '@jseql-next-drizzle/core/eql'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const handler = async (event: any) => {
  const { userId } = event.requestContext.authorizer
  const token = event.requestContext.token

  try {
    const encryptedEmail = await eqlClient.encrypt('test@example.com', {
      table: 'users',
      column: 'email',
    })

    console.log(encryptedEmail)

    return {
      statusCode: 200,
      body: JSON.stringify(encryptedEmail),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
