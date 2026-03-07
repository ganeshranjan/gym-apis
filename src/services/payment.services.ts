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

interface GetPaymentsFilter {
  startDate?: string;
  endDate?: string;
}

export const getPaymentsService = async (
    filter: GetPaymentsFilter,
    currentUser: CurrentUser
  ) => {
    const { startDate, endDate } = filter;
  
    const whereClause: any = {
      gymId: currentUser.gymId
    };
  
    if (startDate && endDate) {
      whereClause.paymentDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }
  
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        member: {
          select: {
            id: true,
            userId: true
          }
        }
      },
      orderBy: {
        paymentDate: "desc"
      }
    });
  
    return payments;
  };
