const axios = require('axios');

const TelegramApi = require('node-telegram-bot-api');

const token = '5985534409:AAFH9VPDBOa0QDmbU34hnaV5tCnLK5cvg8Q';

const bot = new TelegramApi(token, { polling: true })

// определяем команды бота
bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/whatmedo', description: 'Когда не знаешь, что делать' },
    { command: '/quote', description: 'Когда нужна светлая мысль' },
])
// ставим слушатель на сообщения в боте

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const lastName = msg.from.last_name;
    const fistName = msg.from.first_name;
    // используем метод отправки стикера sendSticker
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/2f8/602/2f8602cc-ede8-4bf0-b52f-0f4298fc15ec/thumb-animated-128.mp4');
        if (lastName && fistName === undefined) {
            // используем метод отправки сообщения sendMessage
            await bot.sendMessage(chatId, `Привет, друг!`)
        } else {
            await bot.sendMessage(chatId, `Привет, ${lastName} ${fistName}!`)
        }
        return bot.sendMessage(chatId, `Добро пожаловать в лучший бот пространства Telegram. Приятного пользования!`)
    }
    if (text === '/whatmedo') {
        const { data } = await axios.get('http://www.boredapi.com/api/activity?type=diy');
        const joke = data.activity;
        return bot.sendMessage(chatId, joke);

    }
    if (text === '/quote') {
        const { data } = await axios.get('http://api.forismatic.com/api/1.0/?method=getQuote&format=text');
        return bot.sendMessage(chatId, data);
    }
    return bot.sendMessage(chatId, 'Я тебя не понял, но ты можешь писать мне что хочется, если тебе от этого становится лучше. Я все читаю.');
});