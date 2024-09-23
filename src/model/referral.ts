import { Schema, model } from 'mongoose';

const ReferralsSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            require: true
        },
        referral: {
            type: String,
            default: '',
            require: true
        },
        referred_user_id: {
            type: Number,
            require: true
        },
        referred_username: {
            type: String,
            default: ''
        },
        reward_points: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);

export const Referral = model('referrals', ReferralsSchema);
