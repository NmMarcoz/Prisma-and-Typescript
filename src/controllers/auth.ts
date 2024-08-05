import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
export const login = async (req: Request,res: Response) => {
    try {
        const { email, password } = req.body;
        // Validações -----------------------------//
        if (!email || !password) {
            throw new BadRequestsException(
                "All camps are obrigatory",
                ErrorCodes.ALL_CAMPS_OBRIGATORY,
                400
            );
        }
        let user = await prismaClient.user.findFirst({ where: { email: email } });
        if (!user) {
            throw new BadRequestsException(
                "password or email invalid",
                ErrorCodes.USER_NOT_FOUND,
                404
            );
        }
        // Validação do Hash do password -----------//
        if (!compareSync(password, user.password)) {
            throw new BadRequestsException(
                "password or email invalid",
                ErrorCodes.INCORRECT_PASSWORD,
                400
            );
        }
        // Validações concluídas -----------------//
        const token = jwt.sign({
                userId: user.id,
            },JWT_SECRET
        );

        return res.status(200).send({
            user: [user.name, user.email],
            token: token,
        });
    } catch (error: any) {
        return res.status(error.statusCode).send({
            error: error.message,
            errorCode: error.errorCode,
        });
    }
};
export const signUp = async (req: Request,res: Response) => {
    try {
        const { email, password, name } = req.body;
        // Validações --------------------------//
        if (!email || !password || !name) {
            console.log("all camps obrigatory")
            throw new BadRequestsException(
                "All camps are obrigatory",
                ErrorCodes.ALL_CAMPS_OBRIGATORY,
                400
            );
        }
        if(password.length < 6 || password.length > 14){
            console.log("invalid password")
            throw new BadRequestsException(
                "Password must be 6 to 14 letters",
                ErrorCodes.INVALID_PASSWORD ,
                400
            )
        }
        let userExists = await prismaClient.user.findFirst({ where: { email: email } });
        if (userExists) {
            console.log("user exists")
            throw new BadRequestsException(
                "User already exists",
                ErrorCodes.USER_ALREADY_EXISTS,
                400
            );
        }
        // Processamento -----------------------------//
        let user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashSync(password, 10),
            },
        });
        
        console.log("sent")
        return res.status(200).send({    
                message: "User created",
                userEmail: user.email,
        })    
        ;
    } catch (error: any) {
        console.log("catch") 
        return res.status(error.statusCode).send({
            message: error.message,
        });
    }
};

export const me = async (req: Request, res: Response, next:NextFunction)=>{
    try{
        const user = req.user
        return res.status(200).send({
            username : user.name,
            email: user.email
        })
    }catch(error: any){
        return res.status(401).send({
            message: error.message
        })
    }
}
