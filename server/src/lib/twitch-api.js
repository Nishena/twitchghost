const axios = require('axios');

const helixBaseUrl = 'https://api.twitch.tv/helix';
const helix = axios.create({
    baseURL: helixBaseUrl
});

/**
 * @typedef TwitchAPIUser
 * @prop {string} id The user ID.
 */

/**
 * 
 * @param {any} options
 * @param {string} options.token The OAuth token for the expected user
 * @return {TwitchAPIUser}
 */

async function getUser({ token } = {}) {
    const { data: { data } } = await helix.get('/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(data);
    return data[0] || null;
}

module.exports = {
    getUser,
};