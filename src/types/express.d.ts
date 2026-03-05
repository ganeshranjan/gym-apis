import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        gymId: string;
        role: Role;
      };
    }
  }
}

export {};
