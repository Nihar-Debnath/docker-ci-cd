import express from "express";
import { client } from "@repo/db/client"

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {

    try {
        const response = await client.user.findMany()
        res.json({ response,whoops:"hello" },)
    } catch (error) {
        res.send(error)
    }
})

app.post("/user", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return
    }

    try {
        const response = await client.user.create({
            data: {
                username,
                password
            }
        })
        res.status(201).json({
            message:"user succesfully signed up",
            id: response.id
        })
    } catch (error) {
        res.status(401).send(error)
    }

})

app.listen(8080);