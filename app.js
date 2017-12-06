var express = require('express');
var app = express();
var query = require('./query');
var path = require('path');
var pug = require('pug');
var bodyParser = require('body-parser');
//set port
var port = process.env.PORT || 5000
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
client.connect();

// app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'pug');
// app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CREATE DATABASE blog;
// \c blog;

// create a  table
// CREATE TABLE posts (
//  id serial primary key,
//  title text,
//  excerpt text,
//  body text,
// );
// make one test entry
// insert into posts (title, excerpt,body) values ('This is my test post 1', 'This is my test content of my test post 1.','bodybody  body bhhhhhh');
// insert into posts (title, excerpt,body) values ('This is my project','This what's new .','I am stll learning');
function get_post (id){
              return new Promise(function(resolve, reject){
                  query('SELECT * FROM posts where id=$1',[id], function(err, results){
                    //post.push(rows[i].dataValues);

                   //handle the error and results as appropriate.
                   if(err){
                    reject(err);
          //return done(client);
                    }
                 resolve(results.rows);
// all_messages = results.rows;
                 });
              });
            }

app.get('/', function(request, response){

    client.query('SELECT * FROM posts;', (err, res) => {
      if (err) throw err;
      let arr = [];
      for (let row of res.rows) {
        arr.push(row);
      }
      console.log(arr);
      // client.end();
      response.render('index',{
        posts: arr,
        title: 'Here are all the posts:'
       });
       client.end();
    });

// app.get('/', function(request, response){
//           get_post().then(function(posts){
//             ////some changes here!!!!
//             var all_posts = [];
//             for(var i = 0; i < posts.length; i++) {
//               all_posts.push(posts[i].dataValues);
//
//             }
//             console.log(posts);
//           res.render('index',{
//              posts: posts,
//              title: 'Here are all the posts:'
//           });
//            console.log('Here are all the posts');
//         });
});


app.get('/portfolio', function(req, res){
  res.render('portfolio',{
     title: 'My projects:'

  });
});

app.get('/form', function(req, res){
  res.render('form',{
     title: 'Add New Post:'
  });
});

app.post('/add-post', function(req, res){
  // console.log(req.query.title);
    query('insert into posts (title, excerpt, body) values ($1, $2, $3)', [req.query.title, req.query.username , req.query.message], function(err, results){
   //handle the error and results as appropriate.
             if(err){
              console.log(err);
              // return done(client);
              }
              return done(client);
             console.log('New Post accepted.');
              });
             return res.redirect('/');
    });


app.get('*', function(req, res) {
  res.status(404).send('<h1>uh oh! page not found!</h1>');
});


// var server = app.listen(3333, function(){
//   console.log('Open http://localhost:3333 in the browser');
// });
  // app.listen(port, function() {
  //           console.log('app running');
  //   });
  app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
