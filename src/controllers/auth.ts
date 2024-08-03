import { Request, Response } from 'express'
import { prismaClient } from '..';
import { hashSync, compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets';
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw Error("All the camps are obrigatory")
        }
        let user = await prismaClient.user.findFirst({where:{ email: email}})
        if(!user){
            throw Error("password or email invalid");
        }
        if(!compareSync(password, user.password)){
            throw Error("password or email invalid");
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)

        return res.status(200).send({
            user: [user.name, user.email],
            token: token
        })

    } catch (error: any) {
        return res.status(500).send({
            error: error.message
        })

    }


}

export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw Error("All camps are obrigatory")

        }
        let user = await prismaClient.user.findFirst({ where: { email: email } })
        if (user) {
            throw Error('User already exists')
        }
        user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashSync(password, 10)
            }
        })
        return res.status(200).send(res.json({
            message: "User created",
            userEmail: email
        }))

    } catch (error: any) {
        return res.status(400).send({
            message: error.message
        })
    }


}