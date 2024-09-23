import { Request, Response } from "express";
import { Game } from "../model/game";
import { User } from "../model/user";
import { Referral } from "../model/referral";
import cron from 'node-cron';
import { calculateLevel, remainingTimes, xpForLevel } from "../utils";

export const runCron = async () => {
    // 0 0 * * *
    cron.schedule('*/10 * * * *', async () => {
        console.log('update energy of all games to 10000 every 10 minutes')
        await Game.updateMany({}, { $set: { energy: 10000 } });
    });
}

export const gameByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const game = await Game.findOne({ user_id });
    if (!game) {
        return res.status(200).json({ status: false, message: 'Unregistered User.' });
    } else {
        return res.status(200).json({ status: true, game });
    }
}

export const gameSave = async (req: Request, res: Response) => {
    const { user_id, points } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
        return res.status(400).json({ status: false, message: 'User not found.' });
    }

    try {
        const _game = await Game.findOne({ user_id: user._id });
        // check if user has enough energy
        if (Number(_game?.energy) <= 0) {
            return res.status(200).json({ status: true, game: _game });
        }

        const current_evel = calculateLevel(_game?.total_points as number);
        const level_points = xpForLevel(current_evel);
        let level_up_reward = 0;

        if ((_game?.total_points + points) >= level_points) { // calculate level up reward
            level_up_reward = level_points * 0.1
        }

        // updates points and total points
        const game = await Game.findOneAndUpdate({ user_id: user._id }, { $inc: { points: (points + level_up_reward), total_points: (points + level_up_reward), energy: points * -1 } }, { new: true });

        // get parent user and give referral reward
        const referral_rewards = Math.round(points * 0.15);

        const referral = await Referral.findOneAndUpdate({ referred_user_id: user.id }, { $inc: { reward_points: referral_rewards } }, { new: true });
        if (referral) {
            await Game.findByIdAndUpdate(referral.user_id, { $inc: { points: referral_rewards, total_points: referral_rewards } });
        }

        return res.status(200).json({ status: true, message: 'Successfully Saved', game });
    } catch (error) {
        console.log('error: gameSave => ', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

export const getRemainingTimes = async (req: Request, res: Response) => {
    const times = remainingTimes();
    console.log('times', times);
    return res.status(200).json({ status: true, times })
}