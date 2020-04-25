const axios = require('axios');
const config = require('../config');

const authBaseUrl = 'https://id.twitch.tv/oauth2';
const authAPI = axios.create({
	baseURL: authBaseUrl,
});

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
    // console.log(data);
    return data[0] || null;
}

async function getUsers({ id = [], token }) {
    const qs = new URLSearchParams();
    for(const n of id) {
        qs.append('id', n);
    }
    const { data: { data } } = await helix.get(`/users?${qs}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
}

async function getAccessToken(refresh_token) {
    const qs = new URLSearchParams({
        client_id: config.TWITCH_CLIENT_ID,
        client_secret: config.TWITCH_CLIENT_SECRET ,
        refresh_token,
        grant_type: 'refresh_token'
    });
    const { data } = await authAPI.post(`/token?${qs}`,);
    return data;
}

module.exports = {
    authAPI,
    getUser,
    getUsers,
    getAccessToken,
};