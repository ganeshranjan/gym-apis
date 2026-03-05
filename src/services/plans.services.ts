import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

interface CreatePlanData {
  planName: string;
  price: number;
  durationDays: number;
}

interface CurrentUser {
  gymId: string;
}

interface UpdatePlanData {
  planName: string;
  price: number;
  durationDays: number;
}

export const createPlanService = async (
  data: CreatePlanData,
  currentUser: CurrentUser,
) => {
  const { planName, durationDays, price } = data;
  if (!planName || !durationDays || !price) {
    throw new Error("Name, durationDays and price are required");
  }

  if (durationDays <= 0) {
    throw new Error("Duration must be greater than 0");
  }

  const existingPlan = await prisma.plan.findFirst({
    where: {
      gymId: currentUser.gymId,
      //@ts-ignore
      planName,
      isDeleted: false,
    },
  });

  if (existingPlan) {
    throw new Error("Plan already exists");
  }

  const plans = await prisma.plan.create({
    data: {
      //@ts-ignore
      planName,
      durationDays,
      price: price,
      gymId: currentUser.gymId,
    },
  });
  console.log("plan-service", plans);
  return plans;
};

export const getPlansService = async (gymId: string) => {
  const plans = await prisma.plan.findMany({
    where: {
      gymId: gymId,
      isDeleted: false,
    },
  });
  return plans;
};

export const updatePlanService = async (
  planId: string,
  data: UpdatePlanData,
  currentUser: CurrentUser,
) => {
  const existingPlan = await prisma.plan.findFirst({
    where: {
      id: planId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!existingPlan) {
    throw new Error("Plan not found");
  }

  const updateData: any = {};

  if (data.planName !== undefined) {
    updateData.planName = data.planName;
  }

  if (data.durationDays !== undefined) {
    if (data.durationDays <= 0) {
      throw new Error("Duration must be greater than 0");
    }
    updateData.durationDays = data.durationDays;
  }

  if (data.price !== undefined) {
    if (data.price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    updateData.price = new Prisma.Decimal(data.price);
  }

  const updatedPlan = await prisma.plan.update({
    where: { id: planId },
    data: updateData,
  });

  return updatedPlan;
};
export const getPlanByIdService = async (
  planId: string,
  currentUser: CurrentUser,
) => {
  if (!planId) {
    throw new Error("Plan id is required");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!plan) {
    throw new Error("Plan not found or access denied");
  }

  return plan;
};

export const deletePlanByIdService = async (
  planId: string,
  currentUser: CurrentUser,
) => {
  if (!planId) {
    throw new Error("Plan id is required");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!plan) {
    throw new Error("Plan not found or access denied");
  }

  const deletedPlan = await prisma.plan.update({
    where: { id: planId },
    data: {
      isDeleted: true,
      isActive: false,
    },
  });

  return deletedPlan;
};
