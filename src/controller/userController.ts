import mongoose from "mongoose";
import { Request, Response } from "express";
import * as randomString from "randomstring";
import { User } from "../model/user";
import { Game } from "../model/game";
import { Referral } from "../model/referral";
import prisma from "../lib/prisma";

export const signUp = async (req: Request, res: Response) => {
  const { id, username, first_name, last_name } = req.body;
  if (!id || !username || !first_name) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Parameter" });
  }

  const _user = await User.findOne({ id });
  if (_user) {
    return res
      .status(400)
      .json({ status: false, message: "Already Registered" });
  }

  try {
    const referral = randomString.generate(10);

    const user = new User();
    user.id = id;
    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.referral = referral;
    await user.save();

    const game = new Game();
    game.user_id = user._id;
    await game.save();

    await prisma.telegramUser.upsert({
      where: {
        userId: id,
      },
      update: {
        username: username,
        firstName: first_name,
      },
      create: {
        userId: id,
        username: username,
        firstName: first_name,
      },
    });

    return res.status(200).json({ status: true, user, game });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

export const registerUser = async (params: any) => {
  const { id, username, first_name, last_name } = params;
  if (!id || !username || !first_name) {
    return;
  }

  const _user = await User.findOne({ id });
  if (_user) {
    return;
  }

  try {
    const referral = randomString.generate(10);

    const user = new User();
    user.id = id;
    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.referral = referral;
    await user.save();

    const game = new Game();
    game.user_id = user._id;
    await game.save();

    await prisma.telegramUser.upsert({
      where: {
        userId: id.toString(),
      },
      update: {
        username: username,
        firstName: first_name,
      },
      create: {
        userId: id.toString(),
        username: username,
        firstName: first_name,
      },
    });
  } catch (error) {
    console.log('error in registerUser ===> ', error)
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findOne({ id });
  const game = await Game.findOne({ user_id: user?._id });
  if (!user) {
    return res
      .status(200)
      .json({ status: false, message: "Unregistered User." });
  } else {
    return res.status(200).json({ status: true, user, game });
  }
};

export const updateReferralPoint = async (
  referral: string,
  id: any,
  username: any,
) => {
  const user = await User.findOne({ referral });                                                                  // parent_user;
  const exist_referral = await Referral.findOne({ user_id: user?._id, referred_user_id: id });                    // check already registered user
  if (user?.id !== id && !exist_referral) {                                                                       // check parent user is self
    await Referral.create({
      user_id: user?._id,
      referral,
      referred_username: username,
      referred_user_id: id,
      reward_points: 0,
    });
  }
};

export const getReferralsByUserId = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ status: false, message: "Invalid user_id" });
  }

  try {
    const referrals = await Referral.find({
      user_id: new mongoose.Types.ObjectId(user_id),
    });
    return res.status(200).json({ status: true, referrals });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
