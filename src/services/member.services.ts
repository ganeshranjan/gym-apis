import { PaymentMode, Prisma, Role } from "@prisma/client";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

interface CreateMemberData {
  fullName: string;
  email: string;
  phone: string;
  planId: string;
}

/** Auth payload shape (req.user from auth middleware). */
interface CurrentUser {
  userId: string;
  gymId: string;
  role: Role;
}

interface UpdateMemberData {
  fullName?: string;
  email?: string;
  phone?: string;
  planId?: string;
}

interface CreatePaymentData {
  memberId: string;
  mode: PaymentMode;
}

export const createMemberService = async (
  data: CreateMemberData,
  currentUser: CurrentUser,
) => {
  const { fullName, email, phone, planId } = data;

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });
  if (!plan) {
    throw new Error("Plan not found");
  }

  if (!plan.isActive) {
    throw new Error("Plan is not active");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const tempPassword = "eating5ugar";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const startDate = new Date();
  const expiryDate = new Date(
    startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
  );
  console.log("startDateherecreateMemberService", startDate);
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        gymId: currentUser.gymId,
        fullName: fullName,
        phone,
        email,
        passwordHash: hashedPassword,
        role: "MEMBER",
      },
    });

    const member = await tx.member.create({
      data: {
        gymId: currentUser.gymId,
        fullName: fullName,
        planId: plan.id,
        userId: user.id,
        startDate: startDate,
        expiryDate: expiryDate,
        status: "ACTIVE",
      } as unknown as Prisma.MemberUncheckedCreateInput,
    });

    console.log("memberherecreateMemberService", member);
    return member;
  });

  return result;
};

export const getMembersService = async (currentUser: CurrentUser) => {
  const members = await prisma.member.findMany({
    where: {
      gymId: currentUser.gymId,
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
      plan: {
        select: {
          id: true,
          planName: true,
          durationDays: true,
          price: true,
        },
      },
    },
  });
  return members;
};

export const getMemberByIdService = async (
  memberId: string,
  currentUser: CurrentUser,
) => {
  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      gymId: currentUser.gymId,
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          // id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
      plan: {
        select: {
          // id: true,
          planName: true,
          durationDays: true,
          price: true,
        },
      },
    },
  });
  return member;
};

export const updateMemberService = async (
  memberId: string,
  currentUser: CurrentUser,
  data: UpdateMemberData,
) => {
  const existingMember = await prisma.member.findFirst({
    where: {
      id: memberId,
      gymId: currentUser.gymId,
      isDeleted: false,
      status: "ACTIVE",
    },
    include: {
      plan: true,
      user: true,
    },
  });
  if (!existingMember) {
    throw new Error("Member not found");
  }

  const { fullName, email, phone } = data;
  console.log("existingMember", existingMember);

  const result = await prisma.$transaction(async (tx) => {
    //If email is being updated, check duplicate
    if (email && email !== existingMember.user.email) {
      const existingUser = await tx.user.findFirst({
        where: {
          email,
          gymId: currentUser.gymId,
          isDeleted: false,
        },
      });
      if (existingUser) {
        throw new Error("Email already exists");
      }
    }

    await tx.user.update({
      where: { id: existingMember.user.id },
      data: {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
    });

    return tx.member.findFirst({
      where: {
        id: memberId,
        gymId: currentUser.gymId,
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        plan: {
          select: {
            id: true,
            planName: true,
            durationDays: true,
            price: true,
          },
        },
      },
    });
  });
  return result;
};

export const changePlanService = async (
  memberId: string,
  newPlanId: string,
  currentUser: CurrentUser,
) => {
  const existingMember = await prisma.member.findFirst({
    where: {
      id: memberId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!existingMember) {
    throw new Error("Member not found");
  }

  const newPlan = await prisma.plan.findFirst({
    where: {
      id: newPlanId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!newPlan) {
    throw new Error("Plan not found");
  }

  if (!newPlan.isActive) {
    throw new Error("Plan is not active");
  }

  const startDate = new Date();
  const expiryDate = new Date(
    startDate.getTime() + newPlan.durationDays * 24 * 60 * 60 * 1000,
  );

  const updatedMember = await prisma.member.update({
    where: { id: memberId },
    data: {
      planId: newPlan.id,
      startDate,
      expiryDate,
      status: "ACTIVE",
    },
    include: {
      plan: {
        select: {
          id: true,
          planName: true,
          price: true,
          durationDays: true,
        },
      },
    },
  });

  return updatedMember;
};

export const deleteMemberByIdService = async (
  memberId: string,
  currentUser: CurrentUser,
) => {
  const existingMember = await prisma.member.findFirst({
    where: {
      id: memberId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
  });

  if (!existingMember) {
    throw new Error("Member not found");
  }

  await prisma.member.update({
    where: { id: memberId },
    data: {
      isDeleted: true,
      // status: "INACTIVE", // optional
    },
  });

  return {
    message: "Member deleted successfully",
    memberId,
  };
};

export const createPaymentService = async (
  data: CreatePaymentData,
  currentUser: CurrentUser,
) => {
  const { memberId, mode } = data;

  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      gymId: currentUser.gymId,
      isDeleted: false,
    },
    include: { plan: true },
  });

  console.log("memberheregetMemberPaymentsService", member, currentUser);
  if (!member) {
    throw new Error("Member not found");
  }

  const today = new Date();

  const baseDate =
    member.expiryDate && member.expiryDate > today ? member.expiryDate : today;

  const newExpiryDate = new Date(
    baseDate.getTime() + member.plan.durationDays * 24 * 60 * 60 * 1000,
  );

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        gymId: currentUser.gymId,
        memberId,
        amount: member.plan.price,
        mode,
        paymentDate: new Date(),
      },
    });

    await tx.member.update({
      where: { id: memberId },
      data: {
        expiryDate: newExpiryDate,
        status: "ACTIVE",
      },
    });

    return {
      payment,
      expiryDate: newExpiryDate,
    };
  });

  return result;
};

export const getMemberPaymentsService = async (
  memberId: string,
  currentUser: CurrentUser,
) => {
  const payments = await prisma.payment.findMany({
    where: {
      memberId: memberId,
      gymId: currentUser.gymId,
    },
  });
  console.log("paymentsheregetMemberPaymentsService", payments);
  return payments;
};
