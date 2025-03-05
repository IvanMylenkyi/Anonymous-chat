import { Injectable, NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class GlobalMiddlware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction){
        if (!req.cookies["sessionID"]){
            res.cookie("sessionID", randomUUID());
        }
        next();
    }
}