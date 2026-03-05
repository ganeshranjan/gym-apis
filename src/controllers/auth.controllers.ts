import { Request, Response } from "express";
import {
  registerGym as registerGymService,
  loginService as loginService,
} from "../services/auth.services";

export const registerGym = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log("registerGym", req.body);
  try {
    const { gymName, ownerName, email, password } = req.body;

    if (!gymName || !ownerName || !email || !password) {
      res.status(400).json({
        message: "Gym name, owner name, email and password are required",
      });
      return;
    }
    const result = await registerGymService(
      { gymName, ownerName, email, password },
      res,
    );

    console.log("result--new", result);

    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    console.error("registerGym error:", error);
    res.status(500).json({
      message: "Something went wrong",
      ...(process.env.NODE_ENV !== "production" &&
        error instanceof Error && { error: error.message }),
    });
  }
  //   const { name, email, password } = req.body;
  //   const user = await prisma.user.create({
  //     data: { name, email, password },
  //   });
  //   res.status(201).json(user);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("loginhere", req.body);
  try {
    const { email, password } = req.body;

    const result = await loginService({ email, password }, res);
    console.log("result--login", result);
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("login error:", error);
  }
};
