import { Request, Response } from "express";
import * as attendanceServices from "../services/attendance.services";

export const checkInMemberController = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id as string;
    if (!memberId) {
      return res.status(400).json({ message: "member id is required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const attendance = await attendanceServices.checkInMemberService(
      memberId,
      req.user,
    );
    return res.status(200).json(attendance);
  } catch (error) {
    console.error("checkInMemberController error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getMemberAttendanceController = async (
  req: Request,
  res: Response,
) => {
  try {
    const memberId = req.params.id as string;
    if (!memberId) {
      return res.status(400).json({ message: "member id is required" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const attendance = await attendanceServices.getMemberAttendanceService(
      memberId,
      req.user,
    );
    return res.status(200).json(attendance);
  } catch (error) {
    console.error("getMemberAttendanceController error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getAttendanceController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const attendance = await attendanceServices.getAttendanceService(req.user);
    return res.status(200).json(attendance);
  } catch (error) {
    console.error("getAttendanceController error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getTodayAttendanceController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const attendance = await attendanceServices.getTodayAttendanceService(req.user);
    return res.status(200).json(attendance);
  } catch (error) {
    console.error("getTodayAttendanceController error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
