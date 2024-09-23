import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { RaidStatus } from "@prisma/client";
import { calculatePoints } from "../utils";

export type UserRewards = {
  userName: string | undefined | null;
  imgLink: string | undefined | null;
  points: number | null;
  position: number | null;
  tgUserIds: number[];
};

export const getLeaderBoard = async (req: Request, res: Response) => {
  try {
    const query = await prisma.userRaids.groupBy({
      by: ["userId"],
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: "desc",
        },
      },
      take: 10,
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: query.map((user: any) => user.userId),
        },
      },
      select: {
        id: true,
        userId: true,
        username: true,
        image: true,
        TelegramUser: true,
      },
    });

    const info = query.map((user: any, index: any): UserRewards => {
      const userInfo = users.find((u: any) => u.id === user.userId);
      return {
        userName: userInfo?.username,
        points: user._sum.points,
        imgLink: userInfo?.image,
        position: index + 1,
        tgUserIds: userInfo?.TelegramUser.map((u: any) => u.id) || [],
      };
    });

    return res.status(200).json({ status: true, data: info });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const getAvailableRaids = async (req: Request, res: Response) => {
  const { tgUserId } = req.query;

  if (tgUserId) {
    try {
      const user = await prisma.telegramUser.findFirst({
        where: {
          userId: tgUserId as string,
        },
        include: {
          User: {
            select: {
              id: true,
            },
          },
        },
      });

      const raids = await prisma.raids.findMany({
        where: {
          validUntil: {
            gte: new Date(),
          },
        },
        include: {
          usersRaids: {
            where: {
              userId: user?.User?.id,
            },
          },
        },
      });
      return res.status(200).json({ status: true, data: raids });
    } catch (e) {
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  } else {
    try {
      const raids = await prisma.raids.findMany({
        where: {
          validUntil: {
            gte: new Date(),
          },
        },
      });
      return res.status(200).json({ status: true, data: raids });
    } catch (e) {
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }
};

type reqBodyConnectTwitterType = {
  telegramUserId: string;
  twitter: {
    userId: string;
    username: string;
    image: string;
  };
};

export const connectTwitter = async (req: Request, res: Response) => {
  try {
    const { telegramUserId, twitter } = req.body as reqBodyConnectTwitterType;

    if (!telegramUserId || !twitter) {
      return res.status(400).json({ status: false, message: "Invalid Request" });
    }

    const telegramUser = await prisma.telegramUser.findFirst({
      where: {
        userId: telegramUserId,
      },
    });

    if (!telegramUser) {
      return res.status(400).json({ status: false, message: "Telegram user not found." });
    }

    const twitterUser = await prisma.user.findFirst({
      where: {
        userId: twitter.userId,
      },
    });

    if (!twitterUser) {
      await prisma.user.create({
        data: {
          userId: twitter.userId,
          username: twitter.username.toLowerCase(),
          image: twitter.image,
          TelegramUser: {
            connect: {
              userId: telegramUserId,
            },
          },
        },
      });
    } else {
      await prisma.user.update({
        where: {
          userId: twitter.userId,
        },
        data: {
          TelegramUser: {
            connect: {
              userId: telegramUserId,
            },
          },
        },
      });
    }

    return res.status(200).json({ status: true, message: "User Created Successfully" });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const submitRaid = async (req: Request, res: Response) => {
  try {
    const { tgUserId, raidId, link } = req.body;

    if (!tgUserId || !raidId || !link) {
      return res.status(400).json({ status: false, message: "Invalid Request" });
    }

    const twitterUserName = link.split("/")[3].toLowerCase();
    const tweetId = link.split("/")[5];

    const user = await prisma.telegramUser.findFirst({
      where: {
        userId: tgUserId,
      },
      include: {
        User: true,
      },
    });

    if (!user) {
      return res.status(400).json({ status: false, message: "Telegram user not found." });
    }

    const twitterUser = user.User?.username;

    if (twitterUser !== twitterUserName) {
      return res.status(400).json({ status: false, message: "Invalid Twitter Link" });
    }

    const raidInfo = await prisma.raids.findFirst({
      where: {
        id: raidId,
      },
    });

    if (!raidInfo) {
      return res.status(400).json({ status: false, message: "Invalid Raid" });
    }

    const points = calculatePoints(raidInfo.createdAt, raidInfo.validUntil);

    if (!user.User) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    await prisma.userRaids.create({
      data: {
        userId: user.User.id,
        raidId: raidId,
        raidProof: `https://x.com/${twitterUserName}/status/${tweetId}`,
        status: RaidStatus.SUBMITTED,
        points: points,
      },
    });

    return res.status(200).json({ status: true, message: "Raid Submitted Successfully" });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
