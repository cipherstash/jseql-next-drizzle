import 'dotenv/config'
import { eql, LockContext, type CtsToken } from '@cipherstash/jseql'
export const eqlClient = await eql()

export const getLockContext = (cts_token?: CtsToken) => {
  if (!cts_token) {
    throw new Error(
      '[jseql] A CTS token is required in order to get a lock context.',
    )
  }

  const lockContext = new LockContext({
    ctsToken: cts_token,
  })

  return lockContext
}
