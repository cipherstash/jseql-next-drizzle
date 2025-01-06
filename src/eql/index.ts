import 'dotenv/config'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { eql } = require('@cipherstash/jseql')

export const eqlClient = await eql()
