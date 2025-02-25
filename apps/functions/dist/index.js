var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_eql = require("@jseql-next-drizzle/core/eql");
var handler = async (event) => {
  const { userId } = event.requestContext.authorizer;
  const token = event.requestContext.token;
  if (!userId || !token) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }
  try {
    const encryptedEmail = await import_eql.eqlClient.encrypt("test@example.com", {
      table: "users",
      column: "email"
    });
    console.log(encryptedEmail);
    return {
      statusCode: 200,
      body: JSON.stringify(encryptedEmail)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
};
handler({
  requestContext: {
    authorizer: {
      userId: "cj"
    },
    token: "this_is_a_token_that_is_very_long_and_should_be_a_real_token_but_isnt"
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
