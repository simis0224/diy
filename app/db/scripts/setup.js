/**
 * In app directory, run "mongo 127.0.0.1:27017/diy db/scripts/setup.js" to set up mongo db for the first time
 */

db.user.ensureIndex( { "userName": 1 }, { unique: true } );
db.user.ensureIndex( { "email": 1 }, { unique: true } );