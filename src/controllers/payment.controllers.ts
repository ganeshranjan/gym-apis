import { Request, Response } from "express";
import prisma from "../lib/prisma";
import * as paymentServices from "../services/payment.services";

export const getPaymentsController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { startDate, endDate } = req.query;
    const payments = await paymentServices.getPaymentsService(
      {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      },
      req.user,
    );
    console.log("paymentsheregetPaymentsController", payments);
    res.status(200).json(payments);
  } catch (error) {
    console.error("getPaymentsController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
