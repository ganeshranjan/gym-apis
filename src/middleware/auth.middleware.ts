import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Role } from "@prisma/client";

export interface JwtPayload {
  userId: string;
  gymId: string;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
      return;
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive || user.isDeleted) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      // Assign the shape expected by Express Request (see src/@types/express)
      req.user = {
        userId: user.id,
        gymId: user.gymId,
        role: user.role,
      };
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
