import TelegramBot, { Message } from "node-telegram-bot-api";
import { registerUser, updateReferralPoint } from "./userController";

export const runBot = () => {
    const bot = new TelegramBot(process.env.BOT_TOKEN as string, {
        polling: true,
    });

    // bot.on("polling_error", console.log);

    bot.getMe().then(function (info) {
        console.log(`
        ${info.first_name} is ready, the username is @${info.username}
        `);
    });


    bot.onText(/\/start(?:\s+(.*))?/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
            const referral = match[1];
            await updateReferralPoint(referral, msg.from?.id, msg.from?.username);
        }

        await registerUser(msg.from)

        const replyMarkup = {
            inline_keyboard: [
                [{ text: 'Open Simon Cats', web_app: { url: process.env.WEB_APP_URL as string } }]
            ]
        };

        bot.sendMessage(chatId, 'Welcome Simon Cats!', { reply_markup: replyMarkup });
    })
}