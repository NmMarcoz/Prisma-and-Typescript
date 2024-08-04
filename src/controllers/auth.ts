import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
export const login = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const { email, password } = req.body;
        // Validações -----------------------------//
        if (!email || !password) {
            throw new BadRequestsException(
                "All camps are obrigatory",
                ErrorCodes.ALL_CAMPS_OBRIGATORY
            );
        }
        let user = await prismaClient.user.findFirst({ where: { email: email } });
        if (!user) {
            throw new BadRequestsException(
                "password or email invalid",
                ErrorCodes.INCORRECT_PASSWORD
            );
        }
        // Validação do Hash do password -----------//
        if (!compareSync(password, user.password)) {
            throw new BadRequestsException(
                "password or email invalid",
                ErrorCodes.INCORRECT_PASSWORD
            );
        }
        // Validações concluídas -----------------//
        const token = jwt.sign(
            {
                userId: user.id,
            },
            JWT_SECRET
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
export const signUp = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw new BadRequestsException(
                "All camps are obrigatory",
                ErrorCodes.ALL_CAMPS_OBRIGATORY
            );
        }
        let user = await prismaClient.user.findFirst({ where: { email: email } });
        if (user) {
            throw new BadRequestsException(
                "User already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }
        user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashSync(password, 10),
            },
        });
        return res.status(200).send(
            res.json({
                message: "User created",
                userEmail: email,
            })
        );
    } catch (error: any) {
        return res.status(error.statusCode).send({
            message: error.message,
        });
    }
};
