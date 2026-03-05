import { Request, Response } from "express";
import * as memberServices from "../services/member.services";
import prisma from "../lib/prisma";

export const createMemberController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, phone, planId } = req.body;
    console.log("createMember", req.body);
    if (!name || !email || !phone || !planId) {
      res.status(400).json({
        message: "Name, email, phone and planId are required",
      });
      return;
    }
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const member = await memberServices.createMemberService(req.body, req.user);
    console.log("membernewcontroller", member);
    res.status(201).json(member);
  } catch (error) {
    console.error("createMember error:", error);
    res.status(500).json({ message: "Internal server error " + error });
  }
};

export const getMembersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const members = await memberServices.getMembersService(req.user);
    console.log("memberscontroller", members);
    res.status(200).json(members);
  } catch (error) {
    console.error("getMembers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMemberByIdController = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id as string;
    if (!memberId) {
      res.status(400).json({ message: "Member id is required" });
      return;
    }
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    console.log("getMemberByIdController", req.user, req);
    const memberById = await memberServices.getMemberByIdService(
      memberId,
      req.user,
    );
    res.status(200).json(memberById);
  } catch (error) {
    console.error("getMemberByIdController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMemberController = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id as string;
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const member = await memberServices.updateMemberService(
      memberId,
      req.user,
      req.body,
    );
    console.log("memberupdatedcontroller", member);
    res.status(200).json(member);
  } catch (error) {
    console.error("updateMemberController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePlanController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const memberId = req.params.id as string;
    const newPlanId = req.body.planId as string;
    if (!memberId || !newPlanId) {
      res.status(400).json({ message: "Member id and plan id are required" });
      return;
    }
    const updatedMember = await memberServices.changePlanService(
      memberId,
      newPlanId,
      req.user,
    );
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("changePlanController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMemberByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const memberId = req.params.id as string;
    if (!memberId) {
      res.status(400).json({ message: "Member id is required" });
      return;
    }
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const member = await memberServices.deleteMemberByIdService(
      memberId,
      req.user,
    );
    res.status(200).json(member);
  } catch (error) {
    console.error("deleteMemberByIdController error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
