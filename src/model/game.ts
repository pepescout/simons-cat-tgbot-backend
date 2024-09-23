import { Schema, model } from 'mongoose';

const GamesSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        points: {
            type: Number,
            default: 0
        },
        total_points: {
            type: Number,
            default: 0
        },
        points_per_tap: {
            type: Number,
            default: 1
        },
        profit_per_day: {
            type: Number,
            default: 0
        },
        energy: {
            type: Number,
            default: 10000,
        },
        last_save: {
            type: Date,
            default: Date.now()
        },
    },
    { timestamps: true }
);

export const Game = model('games', GamesSchema);
