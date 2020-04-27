const tmi = require('tmi.js');

const botModel = require('../db/bot');
const channelModel = require('../db/channel');
const commandModel = require('../db/command');
const globalCommandModel = require('../db/globalcommand');
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

        client.on('message', messageHandler);

        await client.connect();
    } catch (error) {
        console.error('Error connecting to twitch...', error);
    }

    return client;
}

function getToken() {
	return client.getOptions().identity.password;
}

async function init() {
    try {
        await getClient();
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
        token: getToken(),
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

async function partChannels(id) {
    await getClient();
    const channels = await twitchAPI.getUsers({
        token: client.getOptions().identity.password,
        id
    });
    // console.log(channels);
    for (const channel of channels) {
        await Promise.all([
            client.part(channel.login),
            sleep(350)
        ]);
    }
}

/**
 * 
 * @param {String} channelId 
 * @param {String} command 
 * @param {String[]} args
 */

async function commandHandler(context) {
    const { reply, channelId, commandName } = context;
    const [ channelCommand, globalCommand ] = await Promise.all([
        commandModel.findOne({ channelId, name: commandName }),
        globalCommandModel.findOne({ name: commandName })
    ]);
    const command = channelCommand || globalCommand;
    if(!command) {
        return;
    }
    if(command.replyText) {
        reply(command.replyText);
    } else {
        // Do stuff
        const commandFn = require(`./commands/${command.name}`);
        commandFn(context);
    }
}

/**
 * @param {string} channel
 * @param {import('tmi.js').ChatUserstate} tags
 * @param {string} message
 * @param {string} self
 */

async function messageHandler(channel, tags, message, self) {
    if(self || tags['message-type'] === 'whisper') {
        return;
    }
    // TODO: Handle other prefixes based on channel settings
    if(message.startsWith('!')) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();
        const reply = msg => client.say(channel, msg);
        commandHandler.call({ reply }, tags['room-id'], command, args);
    }
}

module.exports = {
    init,
    joinChannels,
    partChannels
};