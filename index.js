const TelegramBot = require('node-telegram-bot-api');
const token = '6719636038:AAGQI-LlDM28nx_JCzGSSWJfSbTEoqg-xXM';
const bot = new TelegramBot(token, { polling: true });

let gameState = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    gameState[chatId] = {
        score: 0,
        snake: [{ x: 5, y: 5 }],
        food: { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) },
        direction: 'RIGHT'
    };
    bot.sendMessage(chatId, '欢迎来到LastShop贪吃蛇游戏！使用 /up, /down, /left, /right 控制蛇的移动。');
});

bot.onText(/\/(up|down|left|right)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (!gameState[chatId]) {
        bot.sendMessage(chatId, '请先使用 /start 开始游戏。');
        return;
    }

    gameState[chatId].direction = match[1].toUpperCase();
    updateGame(chatId);
});

function updateGame(chatId) {
    const state = gameState[chatId];
    const head = { ...state.snake[0] };

    switch (state.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
    }

    if (head.x === state.food.x && head.y === state.food.y) {
        state.score += 10;
        state.food = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
    } else {
        state.snake.pop();
    }

    state.snake.unshift(head);

    bot.sendMessage(chatId, `当前得分：${state.score}\n蛇的位置：${JSON.stringify(state.snake)}\n食物的位置：${JSON.stringify(state.food)}`);
}
