import { Role, PaymentMode } from "@prisma/client";
import prisma from "../lib/prisma";

interface CurrentUser {
  userId: string;
  gymId: string;
  role: Role;
}

interface CreatePaymentData {
  memberId: string;
  mode: PaymentMode;
}

// export const createPaymentService = async (
//   data: CreatePaymentData,
//   currentUser: CurrentUser,
// ) => {
//   const { memberId, mode } = data;

//   const member = await prisma.member.findFirst({
//     where: {
//       id: memberId,
//       gymId: currentUser.gymId,
//       isDeleted: false,
//     },
//     include: { plan: true },
//   });

//   if (!member) {
//     throw new Error("Member not found");
//   }

//   const today = new Date();

//   const baseDate =
//     member.expiryDate && member.expiryDate > today ? member.expiryDate : today;

//   const newExpiryDate = new Date(
//     baseDate.getTime() + member.plan.durationDays * 24 * 60 * 60 * 1000,
//   );

//   const result = await prisma.$transaction(async (tx) => {
//     const payment = await tx.payment.create({
//       data: {
//         gymId: currentUser.gymId,
//         memberId,
//         amount: member.plan.price,
//         mode,
//         paymentDate: new Date(),
//       },
//     });

//     await tx.member.update({
//       where: { id: memberId },
//       data: {
//         expiryDate: newExpiryDate,
//         status: "ACTIVE",
//       },
//     });

//     return {
//       payment,
//       expiryDate: newExpiryDate,
//     };
//   });

//   return result;
// };
