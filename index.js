const axios = require('axios');
const TelegramApi = require('node-telegram-bot-api');
const token = '5985534409:AAFH9VPDBOa0QDmbU34hnaV5tCnLK5cvg8Q';
const bot = new TelegramApi(token, { polling: true })
const button = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Цитата', callback_data: '/quote' },
            { text: 'Что делать?', callback_data: '/whatmedo' }]
        ]
    })
}
const start = async () => {

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
            return bot.sendMessage(chatId, `Добро пожаловать в бот Quote. Здесь Вы можете вдохновиться мыслями мудрых или придумать, чем заняться;) Приятного пользования!`, button)
        }
        if (text === '/whatmedo') {
            const { data } = await axios.get('http://www.boredapi.com/api/activity?type=diy');
            const joke = data.activity;
            return bot.sendMessage(chatId, joke, button);

        }
        if (text === '/quote') {
            const { data } = await axios.get('http://api.forismatic.com/api/1.0/?method=getQuote&format=text');
            return bot.sendMessage(chatId, data, button);
        }
        return bot.sendMessage(chatId, 'Я тебя не понял, но ты можешь писать мне что хочется, если тебе от этого становится лучше. Я все читаю.', button);

    });

}
// вешаем обработчики на кнопки
bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const lastName = msg.message.chat.last_name;
    const fistName = msg.message.chat.first_name;

    if (data === '/quote') {
        const { data } = await axios.get('http://api.forismatic.com/api/1.0/?method=getQuote&format=text');
        return bot.sendMessage(chatId, data, button);
    }
    if (data === '/whatmedo') {
        const { data } = await axios.get('http://www.boredapi.com/api/activity?type=diy');
        const joke = data.activity;
        return bot.sendMessage(chatId, joke, button);
    }
})
start()