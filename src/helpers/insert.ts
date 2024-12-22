import "dotenv/config";
import { parseArgs } from "node:util";
import { getTableName } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { eql } = require("@cipherstash/jseql");

const getUser = () => {
	const { values } = parseArgs({
		args: process.argv,
		options: {
			email: {
				type: "string",
			},
			name: {
				type: "string",
			},
		},
		strict: true,
		allowPositionals: true,
	});

	return {
		name: values.name,
		email: values.email,
	};
};

const main = async () => {
	const { name, email } = getUser();

	if (!email || !name) {
		throw new Error("Email and name are required");
	}

	const eqlClient = await eql({
		workspaceId: process.env.CS_WORKSPACE_ID,
		clientId: process.env.CS_CLIENT_ID,
		clientKey: process.env.CS_CLIENT_KEY,
		accessToken: process.env.CS_CLIENT_ACCESS_KEY,
	});

	const encryptedEmail = await eqlClient.encrypt(email, {
		column: users.email.name,
		table: getTableName(users),
	});

	const sql = db.insert(users).values({
		name: name,
		email: encryptedEmail,
		role: "admin",
	});

	const sqlResult = sql.toSQL();
	console.log("[INFO] SQL statement:", sqlResult);

	await sql.execute();
	console.log(
		"[INFO] You've inserted a new user with an encrypted email from the plaintext",
		email,
	);

	process.exit(0);
};

main();
