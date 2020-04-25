const { model, Schema } = require('mongoose');

const BotSchema = new Schema({
    name:  String,
    aliases: [ String ],
    replyText: String,
    fileName: String
}, {
    versionKey: false
});

const globalCommandModel = model('globalCommand', BotSchema);
module.exports = globalCommandModel;