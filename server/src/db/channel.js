const { model, Schema } = require('mongoose');

const ChannelSchema = new Schema({
    twitchId: {
        type: String,
        unique: true,
    },
    enabled: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false
});

/**
 * @typedef channelModel
 * @prop {string} twitchId
 * @prop {boolean} enabled
 */

/** @type {ChannelModel | import('mongoose').Document} */

const channelModel = model('channel', ChannelSchema);
module.exports = channelModel;