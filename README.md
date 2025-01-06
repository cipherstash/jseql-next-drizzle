# jseql demo app 

This project uses the following technologies:

- [Next.js](https://nextjs.org) for the application framework
- [Clerk](https://clerk.com) for auth
- [Vercel](https://vercel.com) for hosting
- [Supabase](https://supabase.com) for database
- [Drizzle ORM](https://drizzle.org) for database access
- [CipherStash](https://cipherstash.com) for data encryption
- [jseql](https://github.com/cipherstash/jseql) for interacting with CipherStash Encrypt

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Second, create a `.env.local` file in the root directory with the following content:

```bash
# Clerk auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase postgres connection string
POSTGRES_URL=

# CipherStash encryption and access keys
CS_CLIENT_ID=
CS_CLIENT_KEY=
CS_CLIENT_ACCESS_KEY=
CS_WORKSPACE_ID=
```

Finally, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

The database is hosted on Supabase and has the following schema which is defined using the Drizzle ORM:

```ts
// Data that is encrypted using jseql is stored as jsonb in postgres

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name").notNull(),
	email: jsonb("email").notNull(),
	role: varchar("role").notNull(),
});
```

> [!NOTE]
> This example does not include any searchable encrypted fields.
> If you want to search on encrypted fields, you will need to install EQL.
> The EQL library ships with custom types that are used to define encrypted fields.
> See the [EQL documentation](https://github.com/cipherstash/encrypted-query-language) for more information.

## @cipherstash/jseql

All the email data is encrypted using jseql and CipherStash.
The cipherstext is stored in the `email` column of the `users` table.
The application is configured to only decrypt the data when the user is signed in, otherwise it will display the encrypted data.

### Npm package

`@cipherstash/jseql` uses custom Rust bindings in order to perform encryptions and decryptions.
We leverage the [Neon project](https://neon-rs.dev/) to provide a JavaScript API for these bindings.

In order to use the `@cipherstash/jseql` package, you will need to add the following to your `next.config.js` file:

```js
const nextConfig = {
  ...
  serverExternalPackages: ['@cipherstash/jseql'],
}
```

### Encryption

There is a helper script which will insert records into the database:

```bash
npx tsx src/helpers/insert.ts --name 'user_name' --email 'user_email'
```

This will insert a record into the database with an encrypted email field.

### Decryption

To view the decrpytion implementation, see the `getUsers` function in [src/app/page.tsx](src/app/page.tsx).
