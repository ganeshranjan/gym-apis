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
