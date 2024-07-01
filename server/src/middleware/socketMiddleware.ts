import { Server } from "socket.io";
import { Request, Response, NextFunction } from "express";

interface RequestWithIO extends Request {
  io: Server;
}

export const socketMiddleware = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as RequestWithIO).io = io;
    next();
  };
};
