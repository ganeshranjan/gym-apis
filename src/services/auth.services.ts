import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { Prisma } from "@prisma/client";

interface RegisterGymData {
  gymName: string;
  ownerName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const registerGym = async (data: RegisterGymData, res: Response) => {
  const { gymName, ownerName, email, password } = data;

  //1. check if gym already exists
  const existingGym = await prisma.gym.findUnique({
    where: { email },
  });

  if (existingGym) {
    return res.status(400).json({ message: "Gym already exists" });
  }

  //2. hash password
  console.log("password2", password);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashedPassword", hashedPassword);

  //3. create gym and user in a transaction
  const result = await prisma.$transaction(async (tx) => {
    //create gym
    const gym = await tx.gym.create({
      data: {
        gymName,
        ownerName,
        email,
      } as Prisma.GymCreateInput,
    });

    //create user
    const user = await tx.user.create({
      data: {
        gymId: gym.id,
        fullName: ownerName,
        email,
        passwordHash: hashedPassword,
        role: "OWNER",
      },
    });

    return { gym, user };
  });
  console.log("result", result);
  //   4. create JWT token
  const token = jwt.sign(
    { userId: result.user.id, gymId: result.gym.id, role: result.user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return {
    token,
    gym: {
      id: result.gym.id,
      gymName: result.gym.gymName,
    },
    user: {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      gymId: result.user.gymId,
    },
  };
};

export const loginService = async (data: LoginData, res: Response) => {
  const { email, password } = data;
  console.log("loginService", email, password);

  //1. check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { gym: true },
  });
  console.log("existingUser", existingUser);

  if (!existingUser) {
    throw new Error("User not found");
  }

  //2. check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.passwordHash,
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid password or email" });
  }

  const token = jwt.sign(
    {
      userId: existingUser.id,
      gymId: existingUser.gymId,
      role: existingUser.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    gym: {
      id: existingUser.gymId,
      gymName: existingUser.gym.gymName,
    },
    user: {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      gymId: existingUser.gymId,
    },
  };
};
