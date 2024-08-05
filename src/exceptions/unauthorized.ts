import { ErrorCodes, HttpException } from "./root";

export class UnauthorizedException extends HttpException{
    constructor(message: string, errorCode: number,statusCode?: number, errors?: any){
        super(message, errorCode,statusCode || 401, errors)
    }
}