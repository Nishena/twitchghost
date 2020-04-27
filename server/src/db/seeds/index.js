const db = require('../');

const globalCommandModel = require('../globalcommand');
const globalCommandList = require('./globalcommands');

(async () => {
    console.log('Seeding global commands...');
    try {
        await globalCommandModel.collection.drop();
        await globalCommandModel.create(...globalCommandList);
        console.log('Global commands seeded!');
    } catch (err) {
        console.error(err);
    } finally {
        db.close();
    }

})();