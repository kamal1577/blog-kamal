var pg = require('pg');
var parseConnectionString = require('pg-connection-string');
// const connectionString = 'postgres://postgres:jannat15@localhost/blog';
 const connectionString ='postgres://odqemyoqwjqcue:c032b5679b0254446c6c6c5fc861f25b71ba1a1b8a773d7094198a9b70903476@ec2-54-235-219-113.compute-1.amazonaws.com:5432/deg4vhpg8v6hac'
// const connectionString = 'postgres://' + process.env.postgres + ':' + process.env.jannat15+ '@localhost/blog';
// const pool = new pg.Pool(typeof connectionString === 'string' ? parseConnectionString.parse(connectionString) : connectionString);
const pool = new pg.Pool(process.env.DATABASE_URL);
// const { Client } = require('pg');
//  const client = new Client({
//    connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });
// client.connect();
//export the adapter function
module.exports = function(queryString, queryParameters, onComplete) {
 //normalize parameters, allowing only passing a query string and an optional `onComplete` handler
 if (typeof queryParameters == 'function') {
   onComplete = queryParameters;
   queryParameters = [];
 }
 //everything else is almost the same as before, replacing hard-coded strings and arrays with parameters
 pool.connect(function(err, client, done) {
   if (err) {
     console.log(`error: connection to database failed. connection string:  ${err}`);
     if (client) {
       done(client);
     }
     //check if `onComplete` exists before calling
     if (onComplete) {
       onComplete(err);
     }
     return;
   }
   client.query(queryString, queryParameters, function(err, result, pool) {
     if (err) {
       done(client);
       console.log(`error: query failed: "${queryString}", "${queryParameters}", ${err}`);
     }
     else {
       done();
     }
     //check if `onComplete` exists before calling
     if (onComplete) {
       onComplete(err, result);
     }
   });
 });
};
