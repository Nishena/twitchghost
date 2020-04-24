const express = require('express');
const cors = require('cors');
const volleyball = require('volleyball');
const helmet = require('helmet');

require('dotenv').config();

require('./db');

const app = express();
app.use(cors());
app.use(volleyball);
app.use(helmet());

app.get('/', (req, res) => {
    res.json({
        message: 'Twitch Bot! 🤖',
    });
});

app.use('/auth/twitch', require('./auth/twitch'));

const port = process.env.PORT || 8888;
const server = app.listen(port, () => console.log('http://localhost:' + server.address().port));