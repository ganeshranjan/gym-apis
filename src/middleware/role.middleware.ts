/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // TypeScript now recognizes 'user' because of the .d.ts file
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user found in request" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: You do not have the required role" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
