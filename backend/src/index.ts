import express, { Request, Response } from 'express'

const PORT = 3000;

const app = express()

app.get('/healthz', (_: Request, res: Response) => {
    console.log("✅ healthz checked")
    res.send("✅")
})

app.listen(PORT, () => {
    console.log(`🚀 Listening to ${PORT}`)
})