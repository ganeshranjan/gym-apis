import { Request, Response } from "express";
import prisma from "../lib/prisma";
import * as paymentServices from "../services/payment.services";

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id as string;
    const { mode } = req.body;
    if (!memberId || !mode) {
      res
        .status(400)
        .json({ message: "Member id, amount and mode are required" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = {
      memberId,
      mode,
    };
    const payment = await paymentServices.createPaymentService(data, req.user);
    res.status(201).json(payment);
  } catch (error) {
    console.error("createPaymentController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
