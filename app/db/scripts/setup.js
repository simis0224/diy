/**
 * In app directory, run "mongo 127.0.0.1:27017/diy db/scripts/setup.js" to set up mongo db for the first time
 */

db.users.ensureIndex( { "username": 1 } );
db.users.ensureIndex( { "email": 1 } );