import express from 'express';

const app = express();

app.get('/api/events', (req, res) => {
    console.log('Клиент подключился :)');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    req.socket.setTimeout(0);

    res.write('data: Соединение установлено\n\n');
    let timeout;


    const sendPrices = () => {
        const randomPrice = () => Math.floor(Math.random() * 100) * 0.05 ;
        const fishPrice = 10 + randomPrice();
        const chipsPrice = 6 + randomPrice();

        res.write(
            `event: fishPrice\n` +
            `data: ${fishPrice.toFixed(2)}\n\n`);

        res.write(
            `event: chipsPrice\n` +
            `data: ${chipsPrice.toFixed(2)}\n\n`);

        timeout = setTimeout(sendPrices, Math.random() * 2000 + 1000);
    }

    sendPrices();

    req.on('close', () => {
        console.log('Клиент отключился');
        clearTimeout(timeout);
        res.end();
    });
});

app.get('/', (_req, res) => {
   res.sendFile(import.meta.dirname + '/sse-client.html');
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});

export default app;