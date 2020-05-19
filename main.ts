// @ts-ignore
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { init, MongoClient } from "https://deno.land/x/mongo@v0.6.0/mod.ts";
// @ts-ignore
import { Application } from "https://deno.land/x/oak/mod.ts";
const env = config();

const app = new Application();
await init();
const client = new MongoClient();
client.connectWithUri(env.MONGO_URI);

const db = client.database("deno_test");
const users = db.collection("users");

await users.insertOne({
  username: "user2",
  password: "pass2",
});

app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

/// @ts-ignore
await app.listen({ port: 8000 });
