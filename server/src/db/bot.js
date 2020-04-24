const { model, Schema } = require('mongoose');

const BotSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    refresh_token: {
        type: String,
        required: true,
    }
});

const botModel = model('bot', BotSchema);
module.exports = botModel;