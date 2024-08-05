import { ErrorCodes, HttpException } from "./root";

export class BadRequestsException extends HttpException{
    constructor(message: string, errorCode:ErrorCodes, statusCode:number){
        super(message, errorCode, statusCode || 400, null)
    }
}