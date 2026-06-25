import { Telegraf } from 'telegraf';

// Environment variable for Bot Token
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);

interface RouteInfo {
    number: string;
    destination: string;
    stages: string[];
    peakFare: number;
    offPeakFare: number;
}

const routes: Record<string, RouteInfo> = {
    "111": {
        number: "111",
        destination: "Ngong",
        stages: ["Railways", "Upper Hill", "Kenyatta", "Dagoretti Corner", "Karen", "Ngong"],
        peakFare: 100,
        offPeakFare: 70
    },
    "24": {
        number: "24",
        destination: "Karen/Hardy",
        stages: ["Kencom", "Kenyatta", "Bomas", "Magadi Road", "Karen", "Hardy"],
        peakFare: 80,
        offPeakFare: 50
    },
    "46": {
        number: "46",
        destination: "Kawangware",
        stages: ["Kencom", "Hurlingham", "Yaya", "Precious", "Kawangware"],
        peakFare: 60,
        offPeakFare: 30
    },
    "102": {
        number: "102",
        destination: "Kikuyu",
        stages: ["Railways", "Wayaki Way", "Kangemi", "Uthiru", "Kikuyu"],
        peakFare: 120,
        offPeakFare: 80
    }
};

bot.start((ctx) => {
    ctx.reply('Welcome to Nairobi Matatu Route Bot! 🚌\nUse /route <number> to get info (e.g., /route 111)');
});

bot.command('route', (ctx) => {
    const text = ctx.message.text.split(' ');
    if (text.length < 2) {
        return ctx.reply('Please provide a route number. Example: /route 111');
    }

    const routeId = text[1];
    const route = routes[routeId];

    if (route) {
        const response = `🚌 *Route ${route.number}* to *${route.destination}*\n\n` +
            `📍 *Stages:* ${route.stages.join(' ➡️ ')}\n\n` +
            `💰 *Peak Fare:* KES ${route.peakFare}\n` +
            `💰 *Off-Peak:* KES ${route.offPeakFare}`;
        ctx.replyWithMarkdown(response);
    } else {
        ctx.reply('Route not found. Try 111, 24, 46, or 102.');
    }
});

bot.command('fare', (ctx) => {
    const text = ctx.message.text.split(' ');
    if (text.length < 2) return ctx.reply('Usage: /fare <route_number>');
    
    const route = routes[text[1]];
    if (route) {
        ctx.reply(`Current estimated fare for ${route.number}: KES ${route.peakFare} (Peak) / KES ${route.offPeakFare} (Off-Peak)`);
    } else {
        ctx.reply('Route not found.');
    }
});

bot.help((ctx) => {
    ctx.reply('Commands:\n/route <num> - Route details\n/fare <num> - Fare estimate\n/list - All available routes');
});

bot.command('list', (ctx) => {
    const list = Object.keys(routes).join(', ');
    ctx.reply(`Available routes: ${list}`);
});

console.log("Matatu Route Bot is running...");
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));