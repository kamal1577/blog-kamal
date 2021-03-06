var pg = require('pg');
var parseConnectionString = require('pg-connection-string');
// const connectionString = 'postgres://postgres:jannat15@localhost/blog';
let connectionString;
if (process.env.DATABASE_URL){
  connectionString = process.env.DATABASE_URL
} else {
 // connString =  'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD;
 connectionString = {
   user: 'postgres',
   password: 'jannat15',
   database: 'blog',
   host: 'localhost',
   port: 5432
 }
}
const pool = new pg.Pool(typeof connectionString === 'string' ? parseConnectionString.parse(connectionString) : connectionString);
// const pool = new pg.Pool(process.env.DATABASE_URL);
// const { Client } = require('pg');
//  const client = new Client({
//           connectionString: process.env.DATABASE_URL,
//            ssl: true,
//        });
 // client.connect();
//export the adapter function
module.exports = function(queryString, queryParameters, onComplete) {
 //normalize parameters, allowing only passing a query string and an optional `onComplete` handler
 if (typeof queryParameters == 'function') {
   onComplete = queryParameters;
   queryParameters = [];
 }
 // const { Client } = require('pg');
 //  const client = new Client({
 //           connectionString: process.env.DATABASE_URL,
 //            ssl: true,
 //        });
 //
 //everything else is almost the same as before, replacing hard-coded strings and arrays with parameters
 pool.connect(function(err, client, done) {
 // pg.connect(connectionString, function(err, client, done) {
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
