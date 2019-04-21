var express = require('express');
var router = express.Router();

//index page
router.get('/', function(req, res, next) {
  res.render('index');
});

//register page
router.route('/regis').get(function(req, res) {
  res.render('regis');
}).post(function(req, res) {
	var username=req.body.username;
	var password=req.body.password;
	var User=global.database;

	User.findOne({name:username},function(err,result) {	
		if(err){
			res.send(500);
		}
		else if(result){
			req.session.error='Username already exist!';
			res.send(500);
		}
		else{
			User.create({
				name:username,
				password:password
			},function(err,doc){
				if(err){
					res.send(500);
				}
				else{
					req.session.error='success!';
					res.send(200);
				}
			})
		}
	});
});

//login page
router.route('/login').get(function(req, res) {
  res.render('login');
}).post(function(req, res) {
	var username=req.body.username;
	var password=req.body.password;
	var User=global.database;

	User.findOne({name:username},function(err,result){
		if(err){
			res.send(500);
		}
		else if(!result){
			req.session.error='Username not exist!';
			res.send(404);
		}
		else{
			if(password!=result.password){
				req.session.error='Wrong password!';
				res.send(404);
			}
			else{
				req.session.user=result;
				res.send(200);
			}
		}
	});
});

//homepage
router.route('/homepage').get(function(req, res) {
	if(!req.session.user) {
		req.session.error = "You need to sign in first!"
  		res.redirect("/login");	
  	}
 	res.render('homepage');
});

//log out function
router.route('/logout').get(function(req, res) {
  	req.session.user=null;
  	req.session.error = null;
  	res.redirect("/");	
});

module.exports = router;
