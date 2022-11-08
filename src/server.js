import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
    return res.send("<h1>Hello world!</h1>");
})

app.get("/login", (req, res) => {
    return res.send("Login here.");
})

app.listen(PORT, () => console.log(`Server listnening on port http://localhost:${PORT}`))