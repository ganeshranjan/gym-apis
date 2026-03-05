import { Request, Response } from "express";
import * as planServices from "../services/plans.services";

export const createPlanController = async (req: Request, res: Response) => {
  try {
    const { planName, durationDays, price } = req.body;
    if (!planName || !durationDays || !price) {
      return res
        .status(400)
        .json({ message: "Name, durationDays and price are required" });
    }

    const plan = await planServices.createPlanService(req.body, {
      gymId: req.user?.gymId as string,
    });

    console.log("plan-controller", plan);
    res.status(201).json(plan);
  } catch (error) {
    console.error("createPlanController error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};

export const getPlansController = async (req: Request, res: Response) => {
  console.log("getPlansController", req.user?.gymId);
  try {
    const plans = await planServices.getPlansService(req.user?.gymId as string);
    console.log("get all plans here ------> ", plans);
    res.status(200).json(plans);
  } catch (error) {
    console.error("getPlansController error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};

export const updatePlanController = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id as string;

    console.log("updatePlanControllerrequestbody", req.body);

    const updatedPlan = await planServices.updatePlanService(planId, req.body, {
      gymId: req.user?.gymId as string,
    });
    console.log("updatedPlan------> controller", updatedPlan);
    res.status(200).json(updatedPlan);
  } catch (error) {
    console.error("updatePlanController error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};

export const getPlanByIdController = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id as string;
    console.log("planId------> controller", req?.user?.gymId, planId);

    const planById = await planServices.getPlanByIdService(planId, {
      gymId: req?.user?.gymId as string,
    });
    console.log("planById------> controller", planById);
    res.status(200).json(planById);
  } catch (error) {
    console.error("getPlanByIdController error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};

export const deletePlanByIdController = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id as string;
    console.log("planId------> controller", req?.user?.gymId, planId);
    const deletedPlan = await planServices.deletePlanByIdService(planId, {
      gymId: req?.user?.gymId as string,
    });
    console.log("deletedPlan------> controller", deletedPlan);
    res.status(200).json(deletedPlan);
  } catch (error) {
    console.error("deletePlanByIdController error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};
