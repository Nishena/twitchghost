const express = require('express');
const axios = require('axios');
const config = require('../config');
const botModel = require('../db/bot');

const redirect_uri = `${config.TWITCH_CLIENT_REDIR_HOST}/auth/twitch/callback`;

const authBaseUrl = 'https://id.twitch.tv/oauth2';
const authAPI = axios.create({
    baseURL: authBaseUrl
});

const router = express.Router( );

router.get('/', (req, res) => {
    const qs = new URLSearchParams({
        client_id: config.TWITCH_CLIENT_ID,
        redirect_uri,
        response_type: 'code',
        scope: req.query.scope
    });
    const redirectUrl = `${authBaseUrl}/authorize?${qs}`;

    res.redirect(redirectUrl);
});

router.get('/callback', async (req, res) => {
    const { code, /* state */ } = req.query;
    const qs = new URLSearchParams({
        client_id: config.TWITCH_CLIENT_ID,
        client_secret: config.TWITCH_CLIENT_SECRET ,
        code,
        grant_type: 'authorization_code',
        redirect_uri
    });

    try {
        const response = await authAPI.post(`/token?${qs}`);
        const bot = await botModel.findOne({ name: 'twitchghost' });
        if(!bot) {
            await botModel.create({
                name: 'twitchghost',
                refresh_token: response.data.refresh_token
            });
        }else{
            bot.refresh_token = response.data.refresh_token;
            await bot.save();
        }
        res.json({
            message: '🤖'
        });
    } catch (error) {
        res.json({
            message: error.message,
            // body: error.response ? error.response.data : error,
        });
    }

});

module.exports = router;