import express from 'express'
import "dotenv/config";
import { db } from "./db/index.ts";     
import { users } from "./db/schema.ts";
import { eq } from 'drizzle-orm';

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/users", async (req, res) => {
    const allUsers = await db.select().from(users);
  res.json(allUsers);
})

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await db.select().from(users).where(eq(users.id, Number(id))).limit(1);
  if (!user.length) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.json(user[0]);
  }
})

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const newUser = await db.insert(users).values({ name, email }).returning();
  res.json(newUser);
});

app.get('/',(req, res) =>{
    res.send("server is running");
})

app.listen(PORT, () =>{ console.log(`server is running on port http://localhost:${PORT}`)})