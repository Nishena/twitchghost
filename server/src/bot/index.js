const tmi = require('tmi.js');

const botModel = require('../db/bot');
const channelModel = require('../db/channel');
const twitchAPI = require('../lib/twitch-api');
const { sleep } = require('../lib/utils');

let client;

async function getClient(token) {
    if(client) {
        return client;
    }
    try {
        const bot = await botModel.findOne({});

        if(!token) {
            ({ access_token: token } = await twitchAPI.getAccessToken(bot.refresh_token));
        } 
        const botUser = await twitchAPI.getUser({ token });

        /** @type {import('tmi.js').Client} */

        client = new tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: botUser.login,
                password: token
            },
            options: { debug: true }
        });

        await client.connect();
    } catch (error) {
        console.error('Error connecting to twitch...', error);
    }
}

async function init() {
    try {
        const bot = await botModel.findOne({});
        const { access_token: token } = await twitchAPI.getAccessToken(bot.refresh_token);
        await getClient(token);
        const dbChannels = await channelModel.find({ enabled: true });
        const id = dbChannels.map(c => c.twitchId);
        await joinChannels(id);
    } catch (error) {
        console.error('Error connecting to twitch...', error);
    }
}

async function joinChannels(id) {
    await getClient();
    const channels = await twitchAPI.getUsers({
        token: client.getOptions().identity.password,
        id
    });
    // console.log(channels);
    for (const channel of channels) {
        await Promise.all([
            client.join(channel.login),
            sleep(350)
        ]);
    }
}

async function partChannel(id) {
    await getClient();
    const [ channel ] = await twitchAPI.getUsers({
        token: client.getOptions().identity.password,
        id,
    });
    await Promise.all([
        client.part(channel.login),
        sleep(350)
    ]);
}

module.exports = {
    init,
    joinChannels,
    partChannel
};