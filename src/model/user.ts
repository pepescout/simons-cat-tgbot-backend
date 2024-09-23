import { Schema, model } from 'mongoose';

const UsersSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true
        },
        username: {
            type: String,
            unique: true
        },
        first_name: {
            type: String,
            default: ''
        },
        last_name: {
            type: String,
            default: ''
        },
        ip: {
            type: String
        },
        country: {
            type: String
        },
        referral: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export const User = model('users', UsersSchema);
