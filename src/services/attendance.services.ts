import { Role } from "@prisma/client";
import prisma from "../lib/prisma";

interface CurrentUser {
  userId: string;
  gymId: string;
  role: Role;
}
export const checkInMemberService = async (
  memberId: string,
  currentUser: CurrentUser,
) => {
  try {
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        gymId: currentUser.gymId,
        isDeleted: false,
      },
    });
    console.log("memberherecheckInMemberService", member);
    if (!member) {
      throw new Error("member not found");
    }
    const attendance = await prisma.attendance.create({
      data: {
        memberId: memberId,
        gymId: currentUser.gymId,
        attendanceDate: new Date(),
        checkInTime: new Date(),
      },
    });
    return attendance;
  } catch (error) {
    console.error("checkInMemberService error:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
};

export const getMemberAttendanceService = async (
  memberId: string,
  currentUser: CurrentUser,
) => {
  try {
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        gymId: currentUser.gymId,
        isDeleted: false,
      },
    });
    if (!member) {
      throw new Error("member not found");
    }
    const attendance = await prisma.attendance.findMany({
      where: {
        memberId: memberId,
        gymId: currentUser.gymId,
      },
    });
    return {
      success: true,
      data: attendance,
      message: "attendance fetched successfully",
    };
  } catch (error) {
    console.error("getMemberAttendanceService error:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
};

export const getAttendanceService = async (currentUser: CurrentUser) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        gymId: currentUser.gymId,
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
    return {
      success: true,
      data: attendance,
      message: "attendance fetched successfully",
    };
  } catch (error) {
    console.error("getAttendanceService error:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
};

export const getTodayAttendanceService = async (currentUser: CurrentUser) => {
  try {
    const now = new Date();
    // Use UTC date boundaries so "today" is consistent regardless of server timezone.
    // Today = calendar day in UTC (00:00:00.000 UTC to 23:59:59.999 UTC).
    const startOfToday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfToday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    const attendance = await prisma.attendance.findMany({
      where: {
        gymId: currentUser.gymId,
        attendanceDate: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        member: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        checkInTime: "desc",
      },
    });
    return {
      success: true,
      data: attendance,
      message: "attendance fetched successfully",
    };
  } catch (error) {
    console.error("getTodayAttendanceService error:", error);
    return {
      success: false,
      message: "internal server error",
    };
  }
};
