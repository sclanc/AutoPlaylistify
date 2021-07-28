/**
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

 var express = require('express');
 var request = require('request');
 var cors = require('cors');
 var querystring = require('querystring');
 var cookieParser = require('cookie-parser');
 var Generator = require('./Generator');
 var DB = require('./DB').DB;
 var bodyParser = require('body-parser');
 
 var args = process.argv.slice(2);
 var client_id = 'afe4eb50b0ae42ccaaf27ae1ffa13ff7';
 var client_secret = args[0];
 var redirect_uri = 'http://localhost:8888/callback';
 var weburl = 'http://localhost:3001/';
 var rds_password = args[1];
 var jsonParser = bodyParser.json();


 var randomStringForCookie = function(length) {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };
 var stateKey = 'spotify_auth_state';
 var app = express();

 app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use(bodyParser());
 
 app.get('/login', function(req, res) {
 
   var state = randomStringForCookie(16);
   res.cookie(stateKey, state);
   res.header("Access-Control-Allow-Origin", "*");
 
   var scope = 'user-read-private user-read-email user-read-private playlist-modify-public playlist-modify-private streaming';
   res.redirect('https://accounts.spotify.com/authorize?' +
     querystring.stringify({
       response_type: 'code',
       client_id: client_id,
       scope: scope,
       redirect_uri: redirect_uri,
       state: state
     }));
 });
 
 app.get('/callback', function(req, res) {
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;
 
   if (state === null || state !== storedState) {
     res.redirect(weburl +
       querystring.stringify({
         error: 'state_mismatch'
       }));
   } else {
     res.clearCookie(stateKey);
     var authOptions = {
       url: 'https://accounts.spotify.com/api/token',
       form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: 'authorization_code'
       },
       headers: {
         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
       },
       json: true
     };
 
     request.post(authOptions, function(error, response, body) {
       if (!error && response.statusCode === 200) { 
         var access_token = body.access_token,
             refresh_token = body.refresh_token; 
         res.redirect(weburl +
           querystring.stringify({
             access_token: access_token,
             refresh_token: refresh_token
           }));
       } else {
         res.redirect(weburl +
           querystring.stringify({
             error: 'invalid_token'
           }));
       }
     });
   }
 });
 
 app.get('/refresh_token', function(req, res) {
 
   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
     form: {
       grant_type: 'refresh_token',
       refresh_token: refresh_token
     },
     json: true
   };
 
   request.post(authOptions, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.send({
         'access_token': access_token
       });
     }
   });
 });
 

 app.post('/user', jsonParser, function(req, res){
  const db = new DB();
  db.connect(rds_password);
  console.log('USER: ', req.body);
  const test = db.query('user', req.body, function(response) {
    const r = {...response, success: true}
    res.send(r);
  });
  db.end();
 })

 app.post('/generator', jsonParser, function(req,res) {
    const db = new DB();
    db.connect(rds_password);
    db.query('saveGenerator', req.body, function (response) {
      if (response.error) {
        res.send(response);
      } else {
        const r = {...response, success: true}
        res.send(r);
      }
    });
    db.end();
 })

 app.get('/generator', function(req,res){
   if (req.query.user_id || req.query.query) {
    const db = new DB();
    db.connect(rds_password);
	if (req.query.user_id ) {
		db.query('getGenerators', req.query, function (response) {
			if (response.error) {
			  res.send({error: response.error});
			} else {
			  const r = {...response}
			  res.send(r);
			}
		  });
	} else if (req.query.query) {
		db.query('searchGenerators', req.query, function (response) {
			if (response.error) {
			  res.send({error: response.error});
			} else {
			  const r = {...response}
			  res.send(r);
			}
		  });
	}

    db.end();
   } else {
     res.send({error: 'user_id or query not provided'});
   }

 })

 //report

 app.get('/report', function(req,res){
	 const db = new DB();
	 db.connect(rds_password);
	 res.header("Access-Control-Allow-Origin", "*");
	 db.query('report', null, function (response) {
	   if (response.error) {
		 res.send({error: response.error});
	   } else {
		 const r = {reportData: [...response]}
		 console.log(r)
		 res.send(r);
	   }
	 });
	 db.end();
 })

 app.get('/delete', function(req,res){
  if (req.query.id) {
   const db = new DB();
   db.connect(rds_password);
   db.query('deleteGenerators', req.query, function (response) {
     if (response.error) {
       res.send({error: response.error});
     } else {
       const r = {...response}
       res.send(r);
     }
   });
   db.end();
  } else {
    res.send({error: 'user_id not provided'});
  }

})

 

 console.log('Listening on 8888');
 app.listen(8888);
 