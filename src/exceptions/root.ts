export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode: number;
    errors: any

    constructor(message:string, errorCode:ErrorCodes, statusCode: number, errors: any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors 
    }
}

export enum ErrorCodes{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    ALL_CAMPS_OBRIGATORY = 1004,
    INVALID_PASSWORD = 1005,
    UNAUTHORIZED = 1006
}