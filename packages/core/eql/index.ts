import 'dotenv/config'
import { eql, LockContext, type CtsToken } from '@cipherstash/jseql'
export const eqlClient = await eql()

export const getLockContext = (cts_token: CtsToken | null) => {
  let lockContext: LockContext

  if (cts_token) {
    lockContext = new LockContext({
      ctsToken: cts_token,
    })

    return lockContext
  }

  return undefined
}
