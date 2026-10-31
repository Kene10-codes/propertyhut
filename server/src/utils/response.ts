import { Response } from "express";


function successResponse(res: Response, statusCode: number, data=null, message: string){
    return res.status(statusCode).json({
        message,
        data,
    })
}

function errorResponse(res: Response, statusCode: number, data=null, message: string){
    return res.status(statusCode).json({
        message,
        data,
    })
}

export {successResponse, errorResponse };