import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes'
import { PrismaClient } from '@prisma/client'
const app:Express = express()

export const prismaClient = new PrismaClient({
    log: ['query']
})

app.use(express.json())
app.use('/', rootRouter);


app.listen(PORT, ()=>{
    console.log("Listening on port 3000")
})
