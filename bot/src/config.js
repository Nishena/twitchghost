require('dotenv').config();

/**
 * @typedef EnvironmentConfiguration
 * @prop {string} PORT The port to listen on.
 * @prop {string} TWITCH_CLIENT_ID Client ID for the Twitch app.
 * @prop {string} TWITCH_CLIENT_SECRET Client OAuth Secret for the Twitch app.
 * @prop {string} TWITCH_CLIENT_REDIR_HOST Client redirect.
 * @prop {string} BOT_REFRESH_TOKEN
 */

/**
 * @type {EnvironmentConfiguration}
 */
const config = {
	...process.env,
};

module.exports = config;