import { NextFunction, Response, Request  } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-request";

const authMiddleware = async( req: Request, res: Response, next: NextFunction)=>{
    try{
        const token = req.headers.authorization
        if(!token){
            throw new UnauthorizedException("You're not authourized", ErrorCodes.UNAUTHORIZED, 401)
        }

        const payload = jwt.verify(token, JWT_SECRET) as any

        const user = await prismaClient.user.findFirst({where:{id: payload.userid}})
        if(!user){
            throw new UnauthorizedException("You're not authorized", ErrorCodes.UNAUTHORIZED, 401)
        }
        req.user = user as any
        next()

    }catch(error:any){
        return res.status(error.statusCode).send({
            message: error.message
        })
    }
}

export default authMiddleware