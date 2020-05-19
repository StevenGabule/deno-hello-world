// @ts-ignore
import { config } from "https://deno.land/x/dotenv/mod.ts";
// @ts-ignore
import { init, MongoClient } from "https://deno.land/x/mongo@v0.6.0/mod.ts";
// @ts-ignore
import {Application, Router} from "https://deno.land/x/oak/mod.ts";
// @ts-ignore
const books = new Map<string, any>();
books.set("1", {
    id: "1",
    title: "The Hound of the Baskervilles",
    author: "Conan Doyle, Author",
});

const env = config();
init();
const client = new MongoClient();
client.connectWithUri(env.MONGO_URI);
const db = client.database("deno_test");
const users = db.collection("users");

const router = new Router();

// @ts-ignore
router.get("/", async (context) => {
    const user = await users.find({ username: { $ne: null } });
    context.response.body = Array.from(user.values());
})
    .get("/book", (context) => {
        context.response.body = Array.from(books.values());
    })
    .get("/book/:id", (context) => {
        if (context.params && context.params.id && books.has(context.params.id)) {
            context.response.body = books.get(context.params.id);
        }
    });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8000});
